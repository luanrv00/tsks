require "thor"
require "tsks/storage"

module Tsks
  class CLI < Thor
    @setup_folder = File.expand_path ENV["SETUP_FOLDER"] || "~/.tsks"

    def self.setup_folder
      @setup_folder
    end

    desc "init", "Setup tsks folder and storage"
    def init
      if File.directory? CLI.setup_folder
        return puts "tsks was already initialized."
      end

      Dir.mkdir CLI.setup_folder
      Tsks::Storage.init
    end

    desc "add TSK", "Add a new tsk (Use --context to specify one i.g. Work)"
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

    desc "done ID", "Mark a tsk you have already done"
    def done id
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      Tsks::Storage.update id
    end

    desc "list", "See all active tsks, filter by context or that are done"
    option :done, type: :boolean
    option :context
    def list
      if !File.directory? CLI.setup_folder
        return puts "tsks was not initialized yet."
      end

      tsks = nil

      if options[:done] && options[:context]
        tsks = Tsks::Storage.select_by({done: 1, context: options[:context]})
      elsif options[:done]
        tsks = Tsks::Storage.select_by({done: 1})
      elsif options[:context]
        tsks = Tsks::Storage.select_by({context: options[:context]})
      else
        tsks = Tsks::Storage.select_by({done: 0})
      end

      if tsks.count > 0
        for tsk in tsks
          puts "#{tsk[:id]} @#{tsk[:context]} #{tsk[:tsk]}"
        end
      else
        puts "No tsks found."
      end
    end
  end
end
