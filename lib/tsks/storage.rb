require "sqlite3"
require "uuid"

module Tsks
  class Storage
    def self.init
      storage = get_storage_instance
      storage.execute <<-SQL
        CREATE TABLE tsks (
          id VARCHAR PRIMARY KEY UNIQUE NOT NULL,
          user_id INTEGER DEFAULT 1,
          tsk VARCHAR NOT NULL,
          context VARCHAR DEFAULT Inbox,
          done BOOLEAN DEFAULT false,
          created_at VARCHAR NOT NULL,
          updated_at VARCHAR NOT NULL
        )
      SQL
    end

    def self.insert tsk, ctx=nil
      storage = get_storage_instance
      now = Time.now.strftime "%Y-%m-%e %H:%M:%S"
      uuid = UUID.new.generate

      if ctx
        storage.execute("
          INSERT INTO tsks (id, tsk, context, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)",
          [uuid, tsk, ctx, now, now]
         )
      else
        storage.execute("
          INSERT INTO tsks (id, tsk, created_at, updated_at)
          VALUES (?, ?, ?, ?)",
          [uuid, tsk, now, now]
         )
      end
    end

    def self.insert_many tsks
      storage = get_storage_instance

      for tsk in tsks
        storage.execute("
          INSERT INTO tsks (id, tsk, context, done, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)",
          [tsk[:id],
           tsk[:tsk],
           tsk[:context],
           tsk[:done],
           tsk[:created_at],
           tsk[:updated_at]]
        )
      end
    end

    def self.update local_id
      storage = get_storage_instance
      storage.execute "UPDATE tsks SET done=true WHERE rowid=?", local_id
    end

    def self.select_by params
      storage = get_storage_instance

      raw_tsks = nil

      if params.count == 2
        raw_tsks = storage.execute(
          "SELECT rowid, * FROM tsks " \
          "WHERE #{params.keys.first}=? and #{params.keys.last}=?",
          [params.values.first, params.values.last]
        )
      else
        raw_tsks = storage.execute(
          "SELECT rowid, * FROM tsks WHERE #{params.keys.first}=?",
          params.values.first)
      end

      tsks = structure_tsks raw_tsks
    end

    def self.select_all local_id=true
      storage = get_storage_instance
      raw_tsks = local_id ?
        storage.execute("SELECT rowid, * FROM tsks") :
        storage.execute("SELECT * FROM tsks")
      tsks = structure_tsks(raw_tsks, local_id=local_id)
    end

    private

    def self.get_storage_instance
      SQLite3::Database.new File.join CLI.setup_folder, "tsks.db"
    end

    def self.structure_tsks tsks, local_id=true
      structured_tsks = []

      for tsk in tsks
        t = {}

        if local_id
           t[:local_id] = tsk[0]
           t[:id] = tsk[1]
           t[:user_id] = tsk[2]
           t[:tsk] = tsk[3]
           t[:context] = tsk[4]
           t[:done] = tsk[5]
           t[:created_at] = tsk[6]
           t[:updated_at] = tsk[7]
        else
           t[:id] = tsk[0]
           t[:user_id] = tsk[1]
           t[:tsk] = tsk[2]
           t[:context] = tsk[3]
           t[:done] = tsk[4]
           t[:created_at] = tsk[5]
           t[:updated_at] = tsk[6]
        end

        structured_tsks.append t
      end

      return structured_tsks
    end
  end
end
