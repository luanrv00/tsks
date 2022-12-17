require 'rails_helper'

RSpec.describe "Signup", type: :request do
  describe "POST /signup" do
    let(:base_uri) { "/v1/" }

    before :all do
      Rails.application.load_seed
    end

    context "new user" do
      let(:signup_data) { {email: "tsks@api.com", password: "s"} }

      it "returns status code 201" do
        post "#{base_uri}/signup", params: signup_data

        expect(response.status).to eq 201
      end

      it "returns an authentication token" do
        post "#{base_uri}/signup", params: signup_data

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "auth_token"
      end

      it "returns the user" do
        post "#{base_uri}/signup", params: signup_data

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "user"
        # TODO: expect(parsed_body["user"]).to eq user data structure
      end

      it "returns ok" do
        post "#{base_uri}/signup", params: signup_data

        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end
    end

    context "Error 400 Bad Request" do
      it "returns status code 400" do
        post "#{base_uri}/signup", params: {}

        expect(response.status).to eq 400
      end

      it "returns not ok" do
        post "#{base_uri}/signup", params: {}

        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "Error 409 Conflict" do
      let (:signup_data) { {email: "registered@api.com", password: "s"} }

      it "returns status code 409" do
        post "#{base_uri}/signup", params: signuped_data

        expect(response.status).to eq 409
      end

      it "returns not ok" do
        post "#{base_uri}/signup", params: signuped_data

        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end
  end
end
