require 'rails_helper'

RSpec.describe "Signin", type: :request do
  describe "POST /signin" do
    let(:base_uri) { "/v1/" }

    context "signin an user" do
      let(:valid_credentials) { {email: "registered@api.com", password: "s"} }

      it "returns status code 200" do
        post "#{base_uri}/signin", params: valid_credentials
        expect(response.status).to eq 200
      end

      it "returns an authentication token" do
        post "#{base_uri}/signin", params: {email: "registered@api.com", password: "s"}
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "auth_token"
      end

      it "returns the user" do
        post "#{base_uri}/signin", params: {email: "registered@api.com", password: "s"}

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "user"
        # TODO: expect(parsed_body["user"]).to eq user data structure
      end

      it "returns ok" do
        post "#{base_uri}/signin", params: {email: "registered@api.com", password: "s"}
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end
    end

    context "Error 400 Bad request" do
      it "returns status code 400" do
        post "#{base_uri}/signin", params: {}
        expect(response.status).to eq 400
      end

      it "Returns not ok" do
        post "#{base_uri}/signin", params: {}
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "ok"
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "Error 401 Unauthorized" do
      let(:invalid_credentials) { {email: "invalid@api.com", password: "s"} }

      it "returns status code 401" do
        post "#{base_uri}/signin", params: invalid_credentials
        expect(response.status).to eq 401
      end

      it "returns not ok" do
        post "#{base_uri}/signin", params: invalid_credentials
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "Error 403 Forbidden" do
      it "returns status code 400" do
        post "#{base_uri}/signin", params: {}
        expect(response.status).to eq 403
      end

      it "Returns not ok" do
        post "#{base_uri}/signin", params: {}
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end
  end
end
