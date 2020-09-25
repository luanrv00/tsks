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
  end
end
