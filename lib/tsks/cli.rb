require "thor"
require "time"
require "tsks/storage"
require "tsks/request"
require "tsks/actions"

module Tsks
  class CLI < Thor
    @setup_folder = File.expand_path "~/.tsks"

    def self.setup_folder
      @setup_folder
    end

    def self.setup_folder= folder_path
      @setup_folder = folder_path
    end

    desc "version", ""
    def version
      puts "tsks #{Tsks::VERSION}"
    end

    desc "init", "setup tsks folder and storage"
    def init
      if File.directory? CLI.setup_folder
        return puts "tsks was already initialized."
      end

      Dir.mkdir CLI.setup_folder
      Tsks::Storage.init
    end

    desc "add TSK", "add a new tsk (Use --context to specify one e.g. --context=work)"
    option :context
    def add tsk
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      if options[:context]
        Tsks::Storage.insert tsk, options[:context]
      else
        Tsks::Storage.insert tsk
      end
    end

    desc "done ID", "mark a tsk you have done"
    def done id
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      op_status = Tsks::Storage.update id
      if !op_status
        puts "the specified tsk do not exist."
      end
    end

    desc "list", "see all active tsks, filter by context or that are done"
    option :done, type: :boolean
    option :context
    def list
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      tsks = nil

      if options[:done] && options[:context]
        tsks = Tsks::Storage.select_by({status: 'done', context: options[:context]})
      elsif options[:done]
        tsks = Tsks::Storage.select_by({status: 'done'})
      elsif options[:context]
        tsks = Tsks::Storage.select_by({context: options[:context]})
      else
        tsks = Tsks::Storage.select_active
      end

      if tsks.count > 0
        for tsk in tsks
          tsk_status = Tsks::Actions.get_tsk_status tsk[:status]
          puts "#{tsk_status} | #{tsk[:local_id]} #{tsk[:tsk]} @#{tsk[:context]}"
        end
      else
        puts "no tsks found."
      end
    end

    desc "register", "register an e-mail to be able to sync your tsks"
    option :email, required: true
    option :password, required: true
    def register
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      begin
        res = Tsks::Request.post "/signup", {email: options[:email],
                                             password: options[:password]}

        if res && res[:ok] == true
          File.write File.join(CLI.setup_folder, "token"), res[:user][:auth_token]
          File.write File.join(CLI.setup_folder, "user_id"), res[:user][:id]
          Tsks::Actions.update_tsks_with_user_id res[:user][:id]
          puts "succesfully registered."
        elsif res && res[:ok] == false
          puts "this e-mail is already registered."
        end
      rescue Errno::ECONNREFUSED, SocketError
        puts "failed to connect to API."
      rescue JSON::ParserError
        puts "error on reading data from API."
      end
    end

    desc "login", "login to be able to sync your tsks"
    option :email, required: true
    option :password, required: true
    def login
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      begin
        res = Tsks::Request.post "/signin", {email: options[:email],
                                             password: options[:password]}

        if res && res[:ok] == true
          File.write File.join(CLI.setup_folder, "token"), res[:user][:auth_token]
          File.write File.join(CLI.setup_folder, "user_id"), res[:user][:id]
          Tsks::Actions.update_tsks_with_user_id res[:user][:id]
          puts "succesfully logged in."
        elsif res && res[:ok] == false
          puts "invalid e-mail or password."
        end
      rescue Errno::ECONNREFUSED, SocketError
        puts "failed to connect to API."
      rescue JSON::ParserError
        puts "error on reading data from API."
      end
    end

    desc "sync", "synchronize your tsks"
    def sync
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      if !File.exist? File.join CLI.setup_folder, "token"
        return puts "please, login before try to sync."
      end

      user_id = File.read File.join CLI.setup_folder, "user_id"
      token = File.read File.join CLI.setup_folder, "token"
      Tsks::Actions.update_tsks_with_user_id user_id
      Tsks::Actions.update_server_for_removed_tsks token
      Tsks::Storage.delete_removed_uuids
      local_tsks = Tsks::Storage.select_all local_id=false

      remote_tsks = []
      begin
        get_res = Tsks::Request.get "/tsks", token
        if get_res[:tsks]
          for tsk in get_res[:tsks]
            tsk[:created_at] = Time.parse(tsk[:created_at]).strftime "%F %T"
            tsk[:updated_at] = Time.parse(tsk[:updated_at]).strftime "%F %T"
            remote_tsks.append tsk
          end

          if get_res[:ok] == true
            local_tsks_to_post = local_tsks - remote_tsks
            if local_tsks_to_post.count > 0
              for tsk in local_tsks_to_post
                Tsks::Request.post "/tsks", token, {tsk: tsk}
              end
            end

            remote_tsks_to_storage = remote_tsks - local_tsks
            if remote_tsks_to_storage.count > 0
              Tsks::Storage.insert_many remote_tsks_to_storage
            end

            puts "your tsks were succesfully synchronized."
          end
        end
      rescue Errno::ECONNREFUSED, SocketError
        puts "failed to connect to API."
      rescue JSON::ParserError
        puts "error on reading data from API."
      end
    end

    desc "remove ID", "..."
    def remove id
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      op_status = Tsks::Storage.delete id
      if !op_status
        puts "the specified tsk do not exist."
      end
    end

    desc "doing ID", "mark a tsk you started doing"
    def doing id
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      op_status = Tsks::Storage.update id, {status: 'doing'}
      if !op_status
        puts "the specified tsk do not exist."
      end
    end
  end
end
