require 'rails_helper'

RSpec.describe "Registers", type: :request do
  describe "POST /register" do
    let(:base_uri) { "/v1/" }

    before :all do
      Rails.application.load_seed
    end

    it "Returns the status code 201 on body" do
      post "#{base_uri}/register", params: {email: "tsks@api.com",
                                        password: "s",
                                        password_confirmation: "s"}

      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "status_code"
      expect(parsed_body["status_code"]).to eq 201
    end

    it "Returns an authentication token" do
      post "#{base_uri}/register", params: {email: "tsks@api.com",
                                        password: "s",
                                        password_confirmation: "s"}

      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "token"
    end

    it "Returns the user_id" do
      #post "/v1"
    end

    it "Returns the status code 409 on body" do
      post "#{base_uri}/register", params: {email: "registered@api.com",
                                        password: "s",
                                        passord_confirmation: "s"}

      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 409
    end
  end
end
