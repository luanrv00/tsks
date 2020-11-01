RSpec.describe Tsks::Storage do
  describe ".init" do
    it "Creates the database table" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive(:execute).twice
      described_class.init
    end
  end

  describe ".insert" do
    it "Inserts received tsk into the storage" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive(:execute)
      described_class.insert "tsk"
    end

    it "Inserts received tsk with received context into the storage" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive(:execute)
      described_class.insert "tsk", "ctx"
    end
  end

  describe ".insert_many" do
    let(:tsks) {
      [{id: 1,
        user_id: 1,
        tsk: "t",
        context: "Inbox",
        done: 0,
        created_at: "0",
        updated_at: "0"}]
    }

    it "Inserts received tsks into the storage" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive(:execute)
      described_class.insert_many tsks
    end
  end

  describe ".update" do
    it "Updates the tsk with received id to be done" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive(:execute)
        .with("UPDATE tsks SET done=true WHERE rowid=?", 1)
      described_class.update 1
    end

    it "Updates data based on received params" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive(:execute)
        .with("UPDATE tsks SET id=? WHERE rowid=?", ["uuid", 1])
      described_class.update 1, {id: "uuid"}
    end
  end

  describe ".select_by" do
    let(:raw_tsks) { [['uuid', 1, 1, 't', 'Work', 1, '0', '0']] }

    it "Returns all done tsks" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      expect(mock).to receive(:execute)
        .with("SELECT rowid, * FROM tsks WHERE done=?", 1).and_return(raw_tsks)
      described_class.select_by({done: 1})
    end

    it "Returns all tsks from storage with the received context" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive(:execute)
        .with("SELECT rowid, * FROM tsks WHERE context=?", 'Work')
        .and_return(raw_tsks)
      described_class.select_by({context: "Work"})
    end

    it "Returns all done tsks from received context" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      expect(mock).to receive(:execute)
        .with("SELECT rowid, * FROM tsks WHERE done=? and context=?", [1, 'Work'])
        .and_return(raw_tsks)
      described_class.select_by({done: 1, context: "Work"})
    end

    it "Returns tsks structured as a hash" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      allow(mock).to receive(:execute).and_return(raw_tsks)
      result = described_class.select_by({done: 1})
      expect(result[0].instance_of? Hash).to be true
    end
  end

  describe ".select_all" do
    let(:raw_tsks) { [['uuid', 1, 1, 't', 'Work', 1, '0', '0']] }

    it "Returns all tsks" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      expect(mock).to receive(:execute)
        .with("SELECT rowid, * FROM tsks").and_return(raw_tsks)
      described_class.select_all
    end

    it "Returns tsks structured as a hash" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      allow(mock).to receive(:execute).and_return(raw_tsks)
      result = described_class.select_all
      expect(result[0].instance_of? Hash).to be true
    end
  end

  describe ".delete" do
    let(:removed_tsks) { [['uuid', 1, 1, 't', 'Inbox', 1, '0', '0']] }

    it "Deletes a tsk from the storage" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      allow(mock).to receive(:execute).and_return(removed_tsks)
      expect(mock).to receive(:execute)
        .with("DELETE FROM tsks WHERE rowid=?", 1)
      described_class.delete 1
    end

    it "Saves the removed tsks uuids into the removed_tsks table" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      allow(mock).to receive(:execute).and_return(removed_tsks)
      allow(mock).to receive(:execute).with("DELETE FROM tsks WHERE rowid=?", 1)
      expect(mock).to receive(:execute)
        .with("INSERT INTO removed_tsks (tsk_uuid) VALUES (?)", removed_tsks[0][0])
      described_class.delete 1
    end

    it "Returns false for non existing tsk" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      allow(mock).to receive(:execute).and_return([])
      op_status = described_class.delete 0
      expect(op_status).to be false
    end
  end

  describe ".select_removed_uuids" do
    it "Selects all ids from removed_tsks" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      expect(mock).to receive(:execute).with("SELECT * FROM removed_tsks")
        .and_return([])
      described_class.select_removed_uuids
    end

    it "Returns an array" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      allow(mock).to receive(:execute).and_return([])
      result = described_class.select_removed_uuids
      expect(result.instance_of? Array).to be true
    end
  end

  describe ".delete_removed_uuids" do
    it "Drops all ids from removed_tsks" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return(mock)
      expect(mock).to receive(:execute).with("DELETE FROM removed_tsks")
      described_class.delete_removed_uuids
    end
  end
end
