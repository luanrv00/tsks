require 'rails_helper'

RSpec.describe "Signup", type: :request do
  describe "POST /signup" do
    let(:api_endpoint) {"/v1/signup"}
    let(:user_email) {"signup@tsks.mail"}
    let(:user_password) {"s"}

    context "cannot without email" do
      before :each do
        post api_endpoint, params: {password: user_password}
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
        post api_endpoint, params: {email: user_email}
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

    context "cannot without valid email" do
      before :each do
        post api_endpoint, params: {email: "random", password: "x"}
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

    context "cannot without unregistered email" do
      let(:registered_email) {"registered@api.com"}

      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post api_endpoint, params: {email: registered_email, password: "s"}
      end

      it "returns status code 409" do
        expect(response.status).to eq 409
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "409 Conflict"
      end
    end

    context "signup succesfully" do
      let(:user_data) { {email: user_email, password: user_password} }

      before :each do
        post api_endpoint, params: user_data
      end

      it "returns status code 201" do
        expect(response.status).to eq 201
      end

      it "returns ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end

      it "returns user" do
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "user"
        # TODO: expect(parsed_body["user"]).to eq user data structure
      end

      it "saves authtentication token" do
        saved_user = User.find_by_email user_email
        expect(saved_user.auth_token).to be_truthy
      end
    end
  end
end
