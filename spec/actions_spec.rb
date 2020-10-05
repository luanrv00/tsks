RSpec.describe Tsks::Actions do

  context ".update_tsks_with_uuid" do
    let(:old_tsks) {
      [{id: "tsk-uuid",
       local_id: 1,
       user_id: 1,
       tsk: "tsk",
       done: 0,
       context: "Inbox",
       created_at: "",
       updated_at: ""},
      {id: "tsk-uuid",
       local_id: 2,
       user_id: 2,
       tsk: "tsk",
       done: 0,
       context: "Inbox",
       created_at: "",
       updated_at: ""}]
    }

    it "Retrieves all tsks from the storage" do
      expect(Tsks::Storage).to receive(:select_all).and_return []
      described_class.update_tsks_with_uuid "uuid"
    end

    it "Iterates over a tsks array by local_id passing received params" do
      allow(Tsks::Storage).to receive(:select_all).and_return(old_tsks)
      expect(Tsks::Storage).to receive(:update).with(1, {user_id: "uuid"})
      expect(Tsks::Storage).to receive(:update).with(2, {user_id: "uuid"})
      described_class.update_tsks_with_uuid "uuid"
    end
  end
end
