require 'rails_helper'

RSpec.describe "Logins", type: :request do
  describe "POST /login" do
    let(:base_uri) { "/v1/" }

    it "Returns the status code 200 on body" do
      post "#{base_uri}/login", params: {email: "registered@api.com", password: "s"}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "status_code"
      expect(parsed_body["status_code"]).to eq 200
    end

    it "Returns an authentication token" do
      post "#{base_uri}/login", params: {email: "registered@api.com", password: "s"}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "token"
    end

    it "Returns the status code 403 on body" do
      post "#{base_uri}/login", params: {email: "invalid@api.com", password: "s"}
      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 403
    end
  end
end
