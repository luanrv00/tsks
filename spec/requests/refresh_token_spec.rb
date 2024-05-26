require "rails_helper"
require_relative '../../app/controllers/v1/refresh_token_controller.rb'

RSpec.describe "refresh_token", type: :request do
  describe "POST /refresh_token" do
    let(:api_endpoint) {"/v1/refresh_token"}

    context "cannot without refresh token" do
      before :each do
        post api_endpoint
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

    context "cannot without valid refresh token" do
      before :each do
        cookies["refresh_token"] = "invalid refresh token"
        post api_endpoint
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

    # - refresh token succesfully 
  end
end