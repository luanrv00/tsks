RSpec.describe Tsks::Storage do
  describe ".init" do
    it "Creates the database table" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive :execute
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
end
