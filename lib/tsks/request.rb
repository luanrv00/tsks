require "httparty"

module Tsks
  class Request
    @base_uri = ENV["BASE_API_URI"] || "https://tsks-api.herokuapp.com/v1"

    def self.base_uri
      @base_uri
    end

    def self.post endpoint, token=nil, body
      uri = URI "#{Request.base_uri}#{endpoint}"

      if token
        res = HTTParty.post uri, body: body,
                                 headers: {authorization: "Bearer #{token}"}
      else
        res = HTTParty.post uri, body: body
      end

      parsed_res = parse_response res.body
    end

    def self.get endpoint, token
      uri = URI "#{Request.base_uri}#{endpoint}"
      res = HTTParty.get uri, headers: {authorization: "Bearer #{token}"}
      parsed_res = parse_response res.body
    end

    def self.delete endpoint, token
      uri = URI "#{Request.base_uri}#{endpoint}"
      res = HTTParty.delete uri, headers: {authorization: "Bearer #{token}"}
      parsed_res = parse_response res.body
    end

    private

    def self.parse_response body
      JSON.parse body, symbolize_names: true
    end
  end
end
