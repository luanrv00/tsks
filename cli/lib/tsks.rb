require "tsks/version"
require "tsks/cli"

module Tsks
  def self.init
    Tsks::CLI.start ARGV
  end
end
