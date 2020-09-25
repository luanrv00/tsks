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
  end
end
