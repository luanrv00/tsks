RSpec.describe Tsks::Storage do
  describe ".init" do
    it "Creates the database table" do
      mock = instance_double(SQLite3::Database)
      allow(SQLite3::Database).to receive(:new).and_return mock
      expect(mock).to receive :execute
      described_class.init
    end
  end
end
