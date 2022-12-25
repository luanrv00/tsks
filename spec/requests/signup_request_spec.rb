require 'rails_helper'

RSpec.describe "Signup", type: :request do
  describe "POST /signup" do
    let(:base_uri) { "/v1/" }

    context "signup user" do
      let(:signup_data) { {email: "tsks@api.com", password: "s"} }

      context "signup succesfully" do
        it "returns status code 201" do
          post "#{base_uri}/signup", params: signup_data

          expect(response.status).to eq 201
        end

        it "returns ok" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq true
        end

        it "returns authentication token" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body).to include "auth_token"
        end

        it "returns user" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body).to include "user"
          # TODO: expect(parsed_body["user"]).to eq user data structure
        end
      end

      context "cannot without email" do
        let(:signup_data) { {password: "s"} }

        it "returns status code 400" do
          post "#{base_uri}/signup", params: signup_data

          expect(response.status).to eq 400
        end

        it "returns not ok" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "400 Bad Request"
        end
      end

      context "cannot without password" do
        let(:signup_data) { {email: "tsks@api.com"} }

        it "returns status code 400" do
          post "#{base_uri}/signup", params: signup_data

          expect(response.status).to eq 400
        end

        it "returns not ok" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "400 Bad Request"
        end
      end

      context "cannot with invalid email" do
        let (:signup_data) { {email: "random string", password: "x"} }

        it "returns status code 400" do
          post "#{base_uri}/signup", params: signup_data

          expect(response.status).to eq 400
        end

        it "returns not ok" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "400 Bad Request"
        end
      end

      context "cannot with already registered email" do
        before :all do
          Rails.application.load_seed
        end

        after :all do
          DatabaseCleaner.clean
        end

        let (:signup_data) { {email: "registered@api.com", password: "s"} }

        it "returns status code 409" do
          post "#{base_uri}/signup", params: signup_data

          expect(response.status).to eq 409
        end

        it "returns not ok" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          post "#{base_uri}/signup", params: signup_data

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "409 Conflict"
        end
      end
    end
  end
end
