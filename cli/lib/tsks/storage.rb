require "sqlite3"

module Tsks
  class Storage
    def self.init
      storage = get_storage_instance
      storage.execute <<-SQL
        CREATE TABLE tsks (
          id INTEGER PRIMARY KEY UNIQUE,
          user_id INTEGER DEFAULT 0,
          tsk VARCHAR NOT NULL,
          status VARCHAR DEFAULT todo,
          context VARCHAR DEFAULT inbox,
          created_at VARCHAR NOT NULL,
          updated_at VARCHAR NOT NULL
        )
      SQL

      storage.execute <<-SQL
        CREATE TABLE removed_tsks (
          tsk_id INTEGER UNIQUE NOT NULL
        )
      SQL
    end

    def self.insert tsk, ctx=nil
      storage = get_storage_instance
      now = Time.now.strftime("%Y-%m-%dT%H:%M:%S.%LZ")

      if ctx
        storage.execute("
          INSERT INTO tsks (tsk, status, context, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)",
          [tsk, 'todo', ctx, now, now]
         )
      else
        storage.execute("
          INSERT INTO tsks (tsk, status, created_at, updated_at)
          VALUES (?, ?, ?, ?)",
          [tsk, 'todo', now, now]
         )
      end
    end

    def self.insert_many tsks
      storage = get_storage_instance

      for tsk in tsks
        storage.execute("
          INSERT INTO tsks
          (id, user_id, tsk, status, context, created_at, updated_at) VALUES
          (?, ?, ?, ?, ?, ?, ?)",
          [tsk[:id],
           tsk[:user_id],
           tsk[:tsk],
           tsk[:status],
           tsk[:context],
           tsk[:created_at],
           tsk[:updated_at]]
        )
      end
    end

    def self.update tsk_id, params=nil
      storage = get_storage_instance

      if params && params.count == 1
        # NOTE
        # there is only a currently in use case covered by this conditional
        # ant that is ok for now, but we should make sure it is updated when
        # Storage.update starting to be called from many different ways.
        storage.execute(
          "UPDATE tsks SET " \
          "#{params.keys.first}=? " \
          "WHERE id=?",
          [params.values.first, tsk_id])
      else
        storage.execute "UPDATE tsks SET status='done' WHERE id=?", tsk_id
      end
    end

    # TODO: write tests
    def self.update_by tsk_params, params=nil
      storage = get_storage_instance

      storage.execute(
        "UPDATE tsks SET " \
        "#{params.keys.first}=? " \
        "WHERE #{tsk_params.keys.first}=?",
        [params.values.first, tsk_params.values.first])
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

    def self.select_all
      storage = get_storage_instance
      raw_tsks = storage.execute("SELECT rowid, * FROM tsks")
      tsks = structure_tsks raw_tsks
    end

    def self.select_active
      storage = get_storage_instance
      raw_tsks = storage.execute("SELECT rowid, * FROM tsks WHERE status NOT LIKE 'done'")
      tsks = structure_tsks raw_tsks
    end

    def self.delete tsk_id
      storage = get_storage_instance
      removed_tsks = storage.execute("SELECT * FROM tsks WHERE id=?", tsk_id)

      if removed_tsks.empty?
        return false
      end
      storage.execute("INSERT INTO removed_tsks (tsk_id) VALUES (?)", removed_tsks[0][0])
      storage.execute("DELETE FROM tsks WHERE id=?", tsk_id)
    end

    def self.select_removed_tsk_ids
      storage = get_storage_instance
      result = storage.execute("SELECT * FROM removed_tsks")

      tsk_ids = []
      for item in result
        tsk_ids.append item[0]
      end
      return tsk_ids
    end

    def self.delete_removed_tsk_ids
      storage = get_storage_instance
      storage.execute("DELETE FROM removed_tsks")
    end

    private

    def self.get_storage_instance
      SQLite3::Database.new File.join CLI.setup_folder, "tsks.db"
    end

    def self.structure_tsks tsks
      structured_tsks = []

      for tsk in tsks
        t = {}
        t[:rowid] = tsk[0]
        t[:id] = tsk[1]
        t[:user_id] = tsk[2]
        t[:tsk] = tsk[3]
        t[:status] = tsk[4]
        t[:context] = tsk[5]
        t[:created_at] = tsk[6]
        t[:updated_at] = tsk[7]

        structured_tsks.append t
      end

      return structured_tsks
    end
  end
end
