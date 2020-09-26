require "sqlite3"

module Tsks
  class Storage
    def self.init
      storage = get_storage_instance
      storage.execute <<-SQL
        CREATE TABLE tsks (
          id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
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

      if ctx
        storage.execute("
          INSERT INTO tsks (tsk, context, created_at, updated_at)
          VALUES (?, ?, ?, ?)",
          [tsk, ctx, now, now]
         )
      else
        storage.execute("
          INSERT INTO tsks (tsk, created_at, updated_at) VALUES (?, ?, ?)",
          [tsk, now, now]
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

    def self.update id
      storage = get_storage_instance
      storage.execute "UPDATE tsks SET done=true WHERE id=?", id
    end

    def self.select_by params
      storage = get_storage_instance

      raw_tsks = nil

      if params.count == 2
        raw_tsks = storage.execute(
          "SELECT * FROM tsks " \
          "WHERE #{params.keys.first}=? and #{params.keys.last}=?",
          [params.values.first, params.values.last]
        )
      else
        raw_tsks = storage.execute(
          "SELECT * FROM tsks WHERE #{params.keys.first}=?",
          params.values.first)
      end

      tsks = structure_tsks raw_tsks
    end

    def self.select_all
      storage = get_storage_instance
      raw_tsks = storage.execute "SELECT * FROM tsks"
      tsks = structure_tsks raw_tsks
    end

    private

    def self.get_storage_instance
      SQLite3::Database.new File.join CLI.setup_folder, "tsks.db"
    end

    def self.structure_tsks tsks
      structured_tsks = []

      for tsk in tsks
        t = {id: tsk[0],
             user_id: tsk[1],
             tsk: tsk[2],
             context: tsk[3],
             done: tsk[4],
             created_at: tsk[5],
             updated_at: tsk[5]}

        structured_tsks.append t
      end

      return structured_tsks
    end
  end
end
