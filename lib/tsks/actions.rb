require "tsks/storage"

module Tsks
  class Actions
    def self.update_tsks_with_uuid uuid
      current_tsks = Tsks::Storage.select_all

      for tsk in current_tsks
        Tsks::Storage.update tsk[:local_id], {user_id: uuid}
      end
    end
  end
end
