require "tsks/storage"

module Tsks
  class Actions
    def self.update_tsks_with_user_id user_id
      current_tsks = Tsks::Storage.select_all

      for tsk in current_tsks
        Tsks::Storage.update_by({rowid: tsk[:rowid]}, {user_id: user_id})
      end
    end

    def self.update_server_for_removed_tsks token
      tsks_uuids = Tsks::Storage.select_removed_tsk_ids

      if !tsks_uuids.empty?
        for id in tsks_uuids
          Tsks::Request.delete "/tsks/#{id}", token
        end
      end
    end

    def self.get_tsk_status status
      available_status = {
        todo: '-',
        done: '*',
        doing: '+',
        freezed: '!',
        archived: 'x',
      }

      available_status[status.to_sym]
    end
  end
end
