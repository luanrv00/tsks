require 'rails_helper'

RSpec.describe "Registers", type: :request do
  describe "POST /register" do
    let(:base_uri) { "/v1/" }

    before :all do
      Rails.application.load_seed
    end

    context "New user" do
      let(:register_data) { {email: "tsks@api.com", password: "s"} }

      it "Returns the status code 201" do
        post "#{base_uri}/register", params: register_data

        expect(response.status).to eq 201
      end

      it "Returns an authentication token" do
        post "#{base_uri}/register", params: register_data

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "token"
      end

      it "Returns the user_id" do
        post "#{base_uri}/register", params: register_data

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "user_id"
      end

      it "Returns ok equals true for success requests" do
        post "#{base_uri}/register", params: register_data

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "ok"
        expect(parsed_body["ok"]).to eq true
      end
    end

    context "Already registered" do
      let (:registered_data) { {email: "registered@api.com", password: "s"} }

      it "Returns the status code 409" do
        post "#{base_uri}/register", params: registered_data

        expect(response.status).to eq 409
      end

      it "Returns ok equals false for conflicted requests" do
        post "#{base_uri}/register", params: registered_data

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "ok"
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "Bad request" do
      it "Returns the status code 400" do
        post "#{base_uri}/register", params: {}

        expect(response.status).to eq 400
      end

      it "Returns ok equals false for bad requests" do
        post "#{base_uri}/register", params: {}

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "ok"
        expect(parsed_body["ok"]).to eq false
      end
    end
  end
end
