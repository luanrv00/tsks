RSpec.describe Tsks::CLI do
  context "commands" do
    let(:user_email) { "cli@api.com" }
    let(:user_password) { "secret" }

    before :all do
      @setup_folder = File.expand_path "~/.tsks_test"
      described_class.setup_folder = @setup_folder
    end

    describe "version" do
      it "shows the current installed version" do
        expect {
          described_class.start ["version"]
        }.to output("tsks #{Tsks::VERSION}\n").to_stdout
      end
    end

    describe "init" do
      after :each do
        if File.directory? @setup_folder
          FileUtils.rmtree @setup_folder
        end
      end

      it "creates the setup folder" do
        allow(Tsks::Storage).to receive :init
        expect(Dir).to receive :mkdir
        described_class.start ["init"]
      end

      it "initializes the database" do
        expect(Tsks::Storage).to receive :init
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
        if File.directory? @setup_folder
          FileUtils.rmtree @setup_folder
        end
      end

      before :each do
        described_class.start ["init"]
      end

      let(:tsk) { "finish my pet project" }
      let(:ctx) { "work" }

      it "enters a new tsk" do
        expect(Tsks::Storage).to receive(:insert).with(tsk)
        described_class.start ["add", tsk]
      end

      it "enters a new tsk with a context" do
        expect(Tsks::Storage).to receive(:insert).with(tsk, ctx)
        described_class.start ["add", tsk, "--context=#{ctx}"]
      end
    end

    describe "done" do
      after :each do
        if File.directory? @setup_folder
          FileUtils.rmtree @setup_folder
        end
      end

      before :each do
        described_class.start ["init"]
        storage = SQLite3::Database.new File.join @setup_folder, "tsks.db"
        storage.execute(
          "insert into tsks (id, tsk, status, created_at, updated_at)
          values ('uuid', 'tsk', 'todo', '0', '0')"
        )
      end

      it "marks a tsk as done" do
        expect(Tsks::Storage).to receive(:update).with(1)
        described_class.start ["done", 1]
      end
    end

    describe "list" do
      before :each do
        described_class.start ["init"]
      end

      after :each do
        if File.directory? @setup_folder
          FileUtils.rmtree @setup_folder
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
        allow(Tsks::Storage).to receive(:select_by).and_return(active_tsks)
        expect {
          described_class.start ["list"]
        }.to output("- | 1 tsk @inbox\n- | 3 tsk @work\n").to_stdout
      end

      it "lists all done tsks" do
        allow(Tsks::Storage).to receive(:select_by).and_return(archived_tsks)
        expect {
          described_class.start ["list", "--done"]
        }.to output("* | 2 tsk @inbox\n").to_stdout
      end

      it "lists all tsks from a context" do
        allow(Tsks::Storage).to receive(:select_by).and_return(work_context_tsks)

        expect {
          described_class.start ["list", "--context=work"]
        }.to output("- | 3 tsk @work\n").to_stdout
      end

      it "shows a no tsks found message" do
        allow(Tsks::Storage).to receive(:select_by).and_return([])

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
        if File.directory? @setup_folder
          FileUtils.rmtree @setup_folder
        end
      end

      let(:user) { {id: 0, email: user_email, auth_token: "token"} }
      let(:req_body) { {email: user_email, password: user_password} }
      let(:res_body) { {ok: true, user: user} }
      let(:bad_res_body) { {ok: false} }

      it "posts credentials to the register api endpoint" do
        expect(Tsks::Request).to receive(:post).with("/signup", req_body).and_return(res_body)
        described_class.start ["register",
                               "--email=#{user_email}",
                               "--password=#{user_password}"]
      end

      it "storages the authentication token" do
        token_path = File.join @setup_folder, "token"
        allow(Tsks::Request).to receive(:post).and_return(res_body)
        allow(File).to receive(:write)

        expect(File).to receive(:write).with(token_path, res_body[:user][:auth_token])
        described_class.start ["register", "--email=@", "--password=s"]
      end

      it "storages the user_id token" do
        user_id_path = File.join @setup_folder, "user_id"
        allow(Tsks::Request).to receive(:post).and_return(res_body)
        allow(File).to receive(:write)

        expect(File).to receive(:write).with(user_id_path, res_body[:user][:id])
        described_class.start ["register", "--email=@", "--password=s"]
      end

      it "updates local tsks with the storaged user id" do
        allow(Tsks::Request).to receive(:post).and_return(res_body)
        allow(File).to receive(:write)

        expect(Tsks::Actions).to receive(:update_tsks_with_user_id).with(res_body[:user][:id])
        described_class.start ["register", "--email=@", "--password=s"]
      end

      it "shows a successful registered message" do
        allow(Tsks::Request).to receive(:post).and_return(res_body)

        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("succesfully registered.\n").to_stdout
      end

      it "shows an already registered message" do
        allow(Tsks::Request).to receive(:post).and_return(bad_res_body)

        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("this e-mail is already registered.\n").to_stdout
      end

      it "shows a feedback message when failing to connect to api" do
        allow(Tsks::Request).to receive(:post).and_raise(Errno::ECONNREFUSED)

        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("failed to connect to API.\n").to_stdout
      end

      it "shows a feedback message when not processing API's response" do
        allow(Tsks::Request).to receive(:post).and_raise(JSON::ParserError)

        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("error on reading data from API.\n").to_stdout
      end

      it "shows a feedback message when api is off or sleeping" do
        allow(Tsks::Request).to receive(:post).and_raise(SocketError)

        expect {
          described_class.start ["register", "--email=@", "--password=s"]
        }.to output("failed to connect to API.\n").to_stdout
      end
    end

    describe "login" do
      before :each do
        described_class.start ["init"]
      end

      after :each do
        if File.directory? @setup_folder
          FileUtils.rmtree @setup_folder
        end
      end

      let(:user) { {id: 0, email: user_email, auth_token: "token"} }
      let(:req_body) { {email: user_email, password: user_password} }
      let(:res_body) { {ok: true, user: user} }
      let(:bad_res_body) { {ok: false} }

      it "posts credentials to the login api endpoint" do
        expect(Tsks::Request).to receive(:post).with("/signin", req_body).and_return(res_body)

        described_class.start ["login",
                               "--email=#{user_email}",
                               "--password=#{user_password}"]
      end

      it "storages the authentication token" do
        token_path = File.join @setup_folder, "token"
        allow(Tsks::Request).to receive(:post).and_return(res_body)
        allow(File).to receive(:write)

        expect(File).to receive(:write).with(token_path, res_body[:user][:auth_token])
        described_class.start ["login", "--email=@", "--password=s"]
      end

      it "storages the user id token" do
        user_id_path = File.join @setup_folder, "user_id"
        allow(Tsks::Request).to receive(:post).and_return(res_body)
        allow(File).to receive(:write)

        expect(File).to receive(:write).with(user_id_path, res_body[:user][:id])
        described_class.start ["login", "--email=@", "--password=s"]
      end

      it "updates local tsks with the storaged user id" do
        allow(Tsks::Request).to receive(:post).and_return(res_body)
        allow(File).to receive(:write)

        expect(Tsks::Actions).to receive(:update_tsks_with_user_id).with(res_body[:user][:id])
        described_class.start ["login", "--email=@", "--password=s"]
      end

      it "shows a successful logged in message" do
        allow(Tsks::Request).to receive(:post).and_return(res_body)

        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("succesfully logged in.\n").to_stdout
      end

      it "shows an invalid credentials message" do
        allow(Tsks::Request).to receive(:post).and_return(bad_res_body)

        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("invalid e-mail or password.\n").to_stdout
      end

      it "shows a feedback message when failing to connect to api" do
        allow(Tsks::Request).to receive(:post).and_raise(Errno::ECONNREFUSED)

        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("failed to connect to API.\n").to_stdout
      end

      it "shows a feedback message when not processing api's response" do
        allow(Tsks::Request).to receive(:post).and_raise(JSON::ParserError)

        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("error on reading data from API.\n").to_stdout
      end

      it "shows a feedback message when api is off or sleeping" do
        allow(Tsks::Request).to receive(:post).and_raise(SocketError)

        expect {
          described_class.start ["login", "--email=@", "--password=s"]
        }.to output("failed to connect to API.\n").to_stdout
      end
    end

    describe "sync" do
      before :each do
        described_class.start ["init"]
        allow(Tsks::Actions).to receive(:update_server_for_removed_tsks)
        allow(Tsks::Storage).to receive(:delete_removed_uuids)
      end

      after :each do
        if File.directory? @setup_folder
          FileUtils.rmtree @setup_folder
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
        File.write File.join(@setup_folder, "token"), "token"
        File.write File.join(@setup_folder, "user_id"), 3
      }

      it "requires a login before sync" do
        expect {
          described_class.start ["sync"]
        }.to output("please, login before try to sync.\n").to_stdout
      end

      it "updates local tsks with the storaged user id" do
        subject
        allow(Tsks::Request).to receive(:get).and_return(get_res)

        expect(Tsks::Actions).to receive(:update_tsks_with_user_id).with("3")
        described_class.start ["sync"]
      end

      it "gets tsks from api" do
        subject
        allow(Tsks::Request).to receive(:post)

        expect(Tsks::Request).to receive(:get).with("/tsks", "token")
          .and_return(get_res)
        described_class.start ["sync"]
      end

      it "posts not synced tsks to api" do
        subject
        allow(Tsks::Request).to receive(:get).and_return(get_res)
        allow(Tsks::Storage).to receive(:select_all).and_return(local_tsks)

        expect(Tsks::Request).to receive(:post).exactly(not_synced_local_tsks.count).times
        described_class.start ["sync"]
      end

      it "storages not present locally tsks" do
        subject
        allow(Tsks::Request).to receive(:get).and_return(get_res)
        allow(Tsks::Storage).to receive(:select_all).and_return(local_tsks)
        allow(Tsks::Request).to receive(:post)

        expect(Tsks::Storage).to receive(:insert_many).with(not_synced_remote_tsks)
        described_class.start ["sync"]
      end

      it "shows a synchronization success message" do
        subject
        allow(Tsks::Request).to receive(:get).and_return(get_res)
        allow(Tsks::Storage).to receive(:select_all).and_return(local_tsks)
        allow(Tsks::Request).to receive(:post)
        allow(Tsks::Storage).to receive(:insert_many)

        expect {
          described_class.start ["sync"]
        }.to output("your tsks were succesfully synchronized.\n").to_stdout
      end

      it "shows a feedback message when failing to connect to api" do
        subject
        allow(Tsks::Request).to receive(:get).and_raise(Errno::ECONNREFUSED)

        expect {
          described_class.start ["sync"]
        }.to output("failed to connect to API.\n").to_stdout
      end

      it "shows a feedback message when not processing api's response" do
        subject
        allow(Tsks::Request).to receive(:get).and_raise(JSON::ParserError)

        expect {
          described_class.start ["sync"]
        }.to output("error on reading data from API.\n").to_stdout
      end

      it "shows a feedback message when api is off or sleeping" do
        subject
        allow(Tsks::Request).to receive(:get).and_raise(SocketError)

        expect {
          described_class.start ["sync"]
        }.to output("failed to connect to API.\n").to_stdout
      end

      it "calls actions.update_server_for_removed_tsks to update remote data" do
        subject

        expect(Tsks::Actions).to receive(:update_server_for_removed_tsks)
        described_class.start ["sync"]
      end

      it "clear the removed_tsks storage after sync" do
        subject

        allow(Tsks::Actions).to receive(:update_server_for_removed_tsks)
        expect(Tsks::Storage).to receive(:delete_removed_uuids)
        described_class.start ["sync"]
      end
    end

    describe "remove" do
      before :each do
        described_class.start ["init"]
      end

      after :each do
        if File.directory? @setup_folder
          FileUtils.rmtree @setup_folder
        end
      end

      it "calls the storage.delete method with the tsk id to be removed" do
        expect(Tsks::Storage).to receive(:delete).with(1)
        described_class.start ["remove", 1]
      end

      it "displays a message for non existing tsks" do
        allow(Tsks::Storage).to receive(:delete).and_return(false)
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
