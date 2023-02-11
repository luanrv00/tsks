RSpec.describe Tsks::CLI do
  context "commands" do
    before :all do
      @setup_folder = file.expand_path "~/.tsks_test"
      described_class.setup_folder = @setup_folder
    end

    describe "version" do
      it "shows the current installed version" do
        expect {
          described_class.start ["version"]
        }.to output("tsks #{tsks::version}\n").to_stdout
      end
    end

    describe "init" do
      after :each do
        if file.directory? @setup_folder
          fileutils.rmtree @setup_folder
        end
      end

      it "creates the setup folder" do
        allow(tsks::storage).to receive :init
        expect(dir).to receive :mkdir
        described_class.start ["init"]
      end

      it "initializes the database" do
        expect(tsks::storage).to receive :init
        described_class.start ["init"]
      end

      it "shows an already initialized message" do
        described_class.start ["init"]
        expect {
          described_class.start ["init"]
        }.to output("tsks was already initialized.\n").to_stdout
      end
    end

    describe "add" do
      after :each do
        if file.directory? @setup_folder
          fileutils.rmtree @setup_folder
        end
      end

      before :each do
        described_class.start ["init"]
      end

      let(:tsk) { "finish my pet project" }
      let(:ctx) { "work" }

      it "enters a new tsk" do
        expect(tsks::storage).to receive(:insert).with(tsk)
        described_class.start ["add", tsk]
      end

      it "enters a new tsk with a context" do
        expect(tsks::storage).to receive(:insert).with(tsk, ctx)
        described_class.start ["add", tsk, "--context=#{ctx}"]
      end
    end

    describe "done" do
      after :each do
        if file.directory? @setup_folder
          fileutils.rmtree @setup_folder
        end
      end

      before :each do
        described_class.start ["init"]
        storage = sqlite3::database.new file.join @setup_folder, "tsks.db"
        storage.execute(
          "insert into tsks (id, tsk, status, created_at, updated_at)
          values ('uuid', 'tsk', 'todo', '0', '0')"
        )
      end

      it "marks a tsk as done" do
        expect(tsks::storage).to receive(:update).with(1)
        described_class.start ["done", 1]
      end
    end

    describe "list" do
      before :each do
        described_class.start ["init"]
      end

      after :each do
        if file.directory? @setup_folder
          fileutils.rmtree @setup_folder
        end
      end

      let(:active_tsks) {
        [{id: "uuid1",
          local_id: 1,
          tsk: "tsk",
          status: 'todo',
          context: "inbox",
          created_at: "2020-09-26 20:14:13",
          updated_at: "2020-09-26 20:14:13"},
         {id: "uuid3",
          local_id: 3,
          tsk: "tsk",
          status: 'todo',
          context: "work",
          created_at: "2020-09-26 20:14:13",
          updated_at: "2020-09-26 20:14:13"}]
      }

      let(:archived_tsks) {
        [{id: "uuid2",
          local_id: 2,
          tsk: "tsk",
          status: 'done',
          context: "inbox",
          created_at: "2020-09-26 20:14:13",
          updated_at: "2020-09-26 20:14:13"}]
      }

      let(:work_context_tsks) {
        [{id: "uuid3",
          local_id: 3,
          tsk: "tsk",
          status: 'todo',
          context: "work",
          created_at: "2020-09-26 20:14:13",
          updated_at: "2020-09-26 20:14:13"}]
      }

      it "lists all active tsks" do
        allow(tsks::storage).to receive(:select_by).and_return(active_tsks)
        expect {
          described_class.start ["list"]
        }.to output("+ | 1 tsk @inbox\n+ | 3 tsk @work\n").to_stdout
      end

      it "lists all done tsks" do
        allow(tsks::storage).to receive(:select_by).and_return(archived_tsks)
        expect {
          described_class.start ["list", "--done"]
        }.to output("- | 2 tsk @inbox\n").to_stdout
      end

      it "lists all tsks from a context" do
        allow(tsks::storage).to receive(:select_by)
          .and_return(work_context_tsks)
        expect {
          described_class.start ["list", "--context=work"]
        }.to output("+ | 3 tsk @work\n").to_stdout
      end

      it "shows a no tsks found message" do
        allow(tsks::storage).to receive(:select_by).and_return([])
        expect {
          described_class.start ["list", "--done", "--context=work"]
        }.to output("no tsks found.\n").to_stdout
      end
    end

    describe "register" do
      before :each do
        described_class.start ["init"]
      end

      after :each do
        if file.directory? @setup_folder
          fileutils.rmtree @setup_folder
        end
      end

      let(:user_email) {{"cli@api.com"}}
      let(:user_password) {{"secret"}}
      let(:req_body) { {email: user_email, password: user_password} }
      let(:res_body) { {ok: true, token: "token", user_id: "uuid"} }
      let(:bad_res_body) { {ok: false} }

      it "posts credentials to the register api endpoint" do
        expect(tsks::request).to receive(:post).with("/register", req_body).and_return(res_body)
        described_class.start ["register",
                               "--email=#{req_body[:email]}",
                               "--password=#{req_body[:password]}"]
      end

      it "storages the authentication token" do
        token_path = file.join @setup_folder, "token"
        allow(tsks::request).to receive(:post).and_return(res_body)
        allow(file).to receive(:write)
        expect(file).to receive(:write).with(token_path, res_body[:token])
        described_class.start ["register", "--email=@", "--password=s"]
      end

      it "storages the user_id token" do
        user_id_path = file.join @setup_folder, "user_id"
        allow(tsks::request).to receive(:post).and_return(res_body)
        allow(file).to receive(:write)
        expect(file).to receive(:write).with(user_id_path, res_body[:user_id])
        described_class.start ["register", "--email=@", "--password=s"]
      end

      it "updates local tsks with the storaged user_id" do
        allow(tsks::request).to receive(:post).and_return(res_body)
        allow(file).to receive(:write)
        expect(tsks::actions).to receive(:update_tsks_with_uuid)
          .with(res_body[:user_id])
        described_class.start ["register", "--email=@", "--password=s"]
      end

      it "shows a successful registered message" do
        allow(tsks::request).to receive(:post).and_return(res_body)
        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("succesfully registered.\n").to_stdout
      end

      it "shows an already registered message" do
        allow(tsks::request).to receive(:post).and_return(bad_res_body)
        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("this e-mail is already registered.\n").to_stdout
      end

      it "shows a feedback message when failing to connect to api" do
        allow(tsks::request).to receive(:post).and_raise(errno::econnrefused)
        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("failed to connect to api.\n").to_stdout
      end

      it "shows a feedback message when not processing api's response" do
        allow(tsks::request).to receive(:post).and_raise(json::parsererror)
        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("error on reading data from api.\n").to_stdout
      end

      it "shows a feedback message when api is off or sleeping" do
        allow(tsks::request).to receive(:post).and_raise(socketerror)
        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("failed to connect to api.\n").to_stdout
      end
    end

    describe "login" do
      before :each do
        described_class.start ["init"]
      end

      after :each do
        if file.directory? @setup_folder
          fileutils.rmtree @setup_folder
        end
      end

      let(:req_body) { {email: "tsks@api.com", password: "secret"} }
      let(:res_body) { {ok: true, token: "token", user_id: "uuid"} }
      let(:bad_res_body) { {ok: false} }

      it "posts credentials to the login api endpoint" do
        expect(tsks::request).to receive(:post)
          .with("/login", req_body).and_return(res_body)
        described_class.start ["login",
                               "--email=#{req_body[:email]}",
                               "--password=#{req_body[:password]}"]
      end

      it "storages the authentication token" do
        token_path = file.join @setup_folder, "token"
        allow(tsks::request).to receive(:post).and_return(res_body)
        allow(file).to receive(:write)
        expect(file).to receive(:write).with(token_path, res_body[:token])
        described_class.start ["login", "--email=@", "--password=s"]
      end

      it "storages the user_id token" do
        user_id_path = file.join @setup_folder, "user_id"
        allow(tsks::request).to receive(:post).and_return(res_body)
        allow(file).to receive(:write)
        expect(file).to receive(:write).with(user_id_path, res_body[:user_id])
        described_class.start ["login", "--email=@", "--password=s"]
      end

      it "updates local tsks with the storaged user_id" do
        allow(tsks::request).to receive(:post).and_return(res_body)
        allow(file).to receive(:write)
        expect(tsks::actions).to receive(:update_tsks_with_uuid)
          .with(res_body[:user_id])
        described_class.start ["login", "--email=@", "--password=s"]
      end

      it "shows a successful logged in message" do
        allow(tsks::request).to receive(:post).and_return(res_body)
        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("succesfully logged in.\n").to_stdout
      end

      it "shows an invalid credentials message" do
        allow(tsks::request).to receive(:post).and_return(bad_res_body)
        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("invalid e-mail or password.\n").to_stdout
      end

      it "shows a feedback message when failing to connect to api" do
        allow(tsks::request).to receive(:post).and_raise(errno::econnrefused)
        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("failed to connect to api.\n").to_stdout
      end

      it "shows a feedback message when not processing api's response" do
        allow(tsks::request).to receive(:post).and_raise(json::parsererror)
        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("error on reading data from api.\n").to_stdout
      end

      it "shows a feedback message when api is off or sleeping" do
        allow(tsks::request).to receive(:post).and_raise(socketerror)
        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("failed to connect to api.\n").to_stdout
      end
    end

    describe "sync" do
      before :each do
        described_class.start ["init"]
        allow(tsks::actions).to receive(:update_server_for_removed_tsks)
        allow(tsks::storage).to receive(:delete_removed_uuids)
      end

      after :each do
        if file.directory? @setup_folder
          fileutils.rmtree @setup_folder
        end
      end

      let(:local_tsks) {
        [{id: "uuid1",
         tsk: "t",
         context: "inbox",
         status: 'todo',
         created_at: "2020-09-26 20:14:13",
         updated_at: "2020-09-26 20:14:13"},
        {id: "uuid2",
         tsk: "t",
         context: "inbox",
         status: 'todo',
         created_at: "2020-09-26 20:14:13",
         updated_at: "2020-09-26 20:14:13"}]
      }
      let(:remote_tsks) {
        [{id: "uuid2",
         tsk: "t",
         context: "inbox",
         status: 'todo',
         created_at: "2020-09-26 20:14:13",
         updated_at: "2020-09-26 20:14:13"},
        {id: "uuid3",
         tsk: "t",
         context: "inbox",
         status: 'todo',
         created_at: "2020-09-26 20:14:13",
         updated_at: "2020-09-26 20:14:13"}]
      }

      let(:not_synced_local_tsks) { [local_tsks.first] }
      let(:get_res) { {ok: true, tsks: remote_tsks} }
      let(:post_body) { {tsk: not_synced_local_tsks.first} }
      let(:not_synced_remote_tsks) { [remote_tsks.last] }

      subject {
        file.write file.join(@setup_folder, "token"), "token"
        file.write file.join(@setup_folder, "user_id"), "uuid"
      }

      it "requires a login before sync" do
        expect {
          described_class.start ["sync"]
        }.to output("please, login before try to sync.\n").to_stdout
      end

      it "updates local tsks with the storaged user_id" do
        subject
        allow(tsks::request).to receive(:get).and_return(get_res)
        expect(tsks::actions).to receive(:update_tsks_with_uuid).with("uuid")
        described_class.start ["sync"]
      end

      it "gets tsks from api" do
        subject
        allow(tsks::request).to receive(:post)
        expect(tsks::request).to receive(:get).with("/tsks", "token")
          .and_return(get_res)
        described_class.start ["sync"]
      end

      it "posts not synced tsks to api" do
        subject
        allow(tsks::request).to receive(:get).and_return(get_res)
        allow(tsks::storage).to receive(:select_all).and_return(local_tsks)
        expect(tsks::request).to receive(:post).exactly(not_synced_local_tsks.count).times

        described_class.start ["sync"]
      end

      it "storages not present locally tsks" do
        subject
        allow(tsks::request).to receive(:get).and_return(get_res)
        allow(tsks::storage).to receive(:select_all).and_return(local_tsks)
        allow(tsks::request).to receive(:post)
        expect(tsks::storage).to receive(:insert_many)
          .with(not_synced_remote_tsks)
        described_class.start ["sync"]
      end

      it "shows a synchronization success message" do
        subject
        allow(tsks::request).to receive(:get).and_return(get_res)
        allow(tsks::storage).to receive(:select_all).and_return(local_tsks)
        allow(tsks::request).to receive(:post)
        allow(tsks::storage).to receive(:insert_many)
        expect {
          described_class.start ["sync"]
        }.to output("your tsks were succesfully synchronized.\n").to_stdout
      end

      it "shows a feedback message when failing to connect to api" do
        subject
        allow(tsks::request).to receive(:get).and_raise(errno::econnrefused)
        expect {
          described_class.start ["sync"]
        }.to output("failed to connect to api.\n").to_stdout
      end

      it "shows a feedback message when not processing api's response" do
        subject
        allow(tsks::request).to receive(:get).and_raise(json::parsererror)
        expect {
          described_class.start ["sync"]
        }.to output("error on reading data from api.\n").to_stdout
      end

      it "shows a feedback message when api is off or sleeping" do
        subject
        allow(tsks::request).to receive(:get).and_raise(socketerror)
        expect {
          described_class.start ["sync"]
        }.to output("failed to connect to api.\n").to_stdout
      end

      it "calls actions.update_server_for_removed_tsks to update remote data" do
        subject
        expect(tsks::actions).to receive(:update_server_for_removed_tsks)
        described_class.start ["sync"]
      end

      it "clear the removed_tsks storage after sync" do
        subject
        allow(tsks::actions).to receive(:update_server_for_removed_tsks)
        expect(tsks::storage).to receive(:delete_removed_uuids)
        described_class.start ["sync"]
      end
    end

    describe "remove" do
      before :each do
        described_class.start ["init"]
      end

      after :each do
        if file.directory? @setup_folder
          fileutils.rmtree @setup_folder
        end
      end

      it "calls the storage.delete method with the tsk id to be removed" do
        expect(tsks::storage).to receive(:delete).with(1)
        described_class.start ["remove", 1]
      end

      it "displays a message for non existing tsks" do
        allow(tsks::storage).to receive(:delete).and_return(false)
        expect {
          described_class.start ["remove", 0]
        }.to output("the specified tsk do not exist.\n").to_stdout
      end
    end
  end

  context "not initialized" do
    it "requires initialization before add a tsk" do
      expect {
        described_class.start ["add", "tsk"]
      }.to output("tsks was not initialized yet.\n").to_stdout
    end

    it "requires initialization before done a tsk" do
      expect {
        described_class.start ["done", 1]
      }.to output("tsks was not initialized yet.\n").to_stdout
    end

    it "requires initialization before list tsks" do
      expect {
        described_class.start ["list"]
      }.to output("tsks was not initialized yet.\n").to_stdout
    end

    it "requires initialization before register" do
      expect {
        described_class.start ["register", "--email=@", "--password=s"]
      }.to output("tsks was not initialized yet.\n").to_stdout
    end

    it "requires initialization before login" do
      expect {
        described_class.start ["login", "--email=@", "--password=s"]
      }.to output("tsks was not initialized yet.\n").to_stdout
    end

    it "requires initialization before sync" do
      expect {
        described_class.start ["sync"]
      }.to output("tsks was not initialized yet.\n").to_stdout
    end

    it "requires initialization before remove" do
      expect {
        described_class.start ["remove", 1]
      }.to output("tsks was not initialized yet.\n").to_stdout
    end
  end
end
