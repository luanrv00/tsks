require "sqlite3"

module Tsks
  class Storage
    def self.init
      storage = get_storage_instance
      storage.execute <<-SQL
        CREATE TABLE tsks (
          id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
          tsk VARCHAR NOT NULL,
          context VARCHAR DEFAULT Inbox,
          done BOOLEAN DEFAULT false,
          created_at VARCHAR NOT NULL,
          updated_at VARCHAR NOT NULL
        )
      SQL
    end

    private

    def self.get_storage_instance
      SQLite3::Database.new File.join CLI.setup_folder, "tsks.db"
    end
  end
end
