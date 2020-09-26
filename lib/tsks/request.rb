require "httparty"

module Tsks
  class Request
    @base_uri = ENV["BASE_API_URI"]

    def self.base_uri
      @base_uri
    end

    def self.post endpoint, token=nil, body
      uri = URI "#{Request.base_uri}#{endpoint}"
      res = HTTParty.post uri, body: body
      parsed_res = parse_response res.body
    end

    private

    def self.parse_response body
      JSON.parse body, symbolize_names: true
    end
  end
end
