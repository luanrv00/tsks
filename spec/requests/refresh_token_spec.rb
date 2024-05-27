require 'rails_helper'

RSpec.describe "refresh_token", type: :request do
  describe "POST /refresh_token" do
    let(:api_endpoint) {"/v1/refresh_token"}
    let(:not_found_refresh_token) {"eyJhbGciOiJub25lIn0.eyJlbWFpbCI6InVuYXV0aG9yaXplZHJlZnJlc2h0b2tlbkB0c2tzLmNvbSJ9."}
    let(:unauthorized_refresh_token) {"eyJhbGciOiJub25lIn0.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSJ9."}

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
      context "when is invalid" do
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

      context "when is not found" do
        before :each do
          cookies["refresh_token"] = not_found_refresh_token
          post api_endpoint
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

      context "when is unauthorized" do
        before :all do
          Rails.application.load_seed
        end

        after :all do
          DatabaseCleaner.clean
        end

        before :each do
          cookies["refresh_token"] = unauthorized_refresh_token
          post api_endpoint
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
    end

    context "refresh token succesfully" do
    end
  end
end