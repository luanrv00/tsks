require 'rails_helper'

RSpec.describe "Signin", type: :request do
  describe "POST /signin" do
    let(:signin_endpoint) { "/v1/signin" }
    let(:user_email) {"registered@api.com"}
    let(:user_password) {"s"}

    context "cannot without email" do
      before :each do
        post signin_endpoint, params: {password: user_password}
      end

      it "returns status code 400" do
        expect(response.status).to eq 400
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "400 Bad Request"
      end
    end

    context "cannot without password" do
      before :each do
        post signin_endpoint, params: {email: user_email}
      end

      it "returns status code 400" do
        expect(response.status).to eq 400
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "400 Bad Request"
      end
    end

    context "cannot with wrong password" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post signin_endpoint, params: {email: user_email, password: "wrong"}
      end

      it "returns status code 401" do
        expect(response.status).to eq 401
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "401 Unauthorized"
      end
    end

    context "cannot with not registered email" do
      before :each do
        post signin_endpoint, params: {email: "new@tsks.api", password: "x"}
      end

      it "returns status code 404" do
        expect(response.status).to eq 404
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "404 Not Found"
      end
    end

    context "cannot with invalid email" do
      before :each do
        post signin_endpoint, params: {email: "invalid string", password: "x"}
      end

      it "returns status code 400" do
        expect(response.status).to eq 400
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "400 Bad Request"
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
        post signin_endpoint, params: {email: user_email, password: user_password}
      end

      it "returns status code 200" do
        expect(response.status).to eq 200
      end

      it "returns ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end

      it "returns authentication token" do
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "auth_token"
      end

      it "returns user" do
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "user"
        # TODO: expect(parsed_body["user"]).to eq user data structure
      end
    end
  end
end
