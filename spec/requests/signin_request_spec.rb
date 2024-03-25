require 'rails_helper'

RSpec.describe "Signin", type: :request do
  describe "POST /signin" do
    let(:api_endpoint) { "/v1/signin" }
    let(:user_email) {"registered@api.com"}
    let(:user_wo_auth_token_email) {"missingauthtoken@api.com"}
    let(:user_password) {"s"}

    context "cannot without email" do
      before :each do
        post api_endpoint, params: {password: user_password}
      end

      it "returns status code 400" do
        expect(response.status).to eq 400
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "400 Bad Request"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "cannot without valid email" do
      before :each do
        post api_endpoint, params: {email: "invalid string", password: "x"}
      end

      it "returns status code 400" do
        expect(response.status).to eq 400
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "400 Bad Request"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "cannot without registered email" do
      before :each do
        post api_endpoint, params: {email: "new@tsks.api", password: "x"}
      end

      it "returns status code 404" do
        expect(response.status).to eq 404
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "404 Not Found"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "cannot without password" do
      before :each do
        post api_endpoint, params: {email: user_email}
      end

      it "returns status code 400" do
        expect(response.status).to eq 400
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "400 Bad Request"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "cannot without correct password" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post api_endpoint, params: {email: user_email, password: "wrong"}
      end

      it "returns status code 401" do
        expect(response.status).to eq 401
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "401 Unauthorized"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "cannot without saved authentication token" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post api_endpoint, params: {email: user_wo_auth_token_email, password: user_password}
      end

      it "returns status code 500" do
        expect(response.status).to eq 500
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "500 Internal Server Error"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "signin succesfully" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post api_endpoint, params: {email: user_email, password: user_password}
      end

      it "returns status code 200" do
        expect(response.status).to eq 200
      end

      it "returns message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "200 Success"
      end

      it "returns ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end

      it "returns authentication token" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["user"]).to include "auth_token"
      end

      # TODO: expect(parsed_body["user"]).to eq user data structure
      it "returns user" do
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "user"
      end
    end
  end
end
