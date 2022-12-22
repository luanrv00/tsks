require 'rails_helper'

RSpec.describe "Signin", type: :request do
  describe "POST /signin" do
    let(:base_uri) { "/v1/" }

    context "signin user" do
      let(:valid_credentials) { {email: "registered@api.com", password: "s"} }

      context "signin succesfully" do
        before :all do
          Rails.application.load_seed
        end

        after :all do
          DatabaseCleaner.clean
        end

        it "returns status code 200" do
          post "#{base_uri}/signin", params: valid_credentials

          expect(response.status).to eq 200
        end

        it "returns ok" do
          post "#{base_uri}/signin", params: valid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq true
        end

        it "returns authentication token" do
          post "#{base_uri}/signin", params: valid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body).to include "auth_token"
        end

        it "returns user" do
          post "#{base_uri}/signin", params: valid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body).to include "user"
          # TODO: expect(parsed_body["user"]).to eq user data structure
        end
      end

      context "cannot without email" do
        let(:invalid_credentials) { {password: "s"} }

        it "returns status code 400" do
          post "#{base_uri}/signin", params: invalid_credentials

          expect(response.status).to eq 400
        end

        it "returns not ok" do
          post "#{base_uri}/signin", params: invalid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          post "#{base_uri}/signin", params: invalid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "400 Bad Request"
        end
      end

      context "cannot without password" do
        let(:invalid_credentials) { {email: "registered@api.com"} }

        it "returns status code 400" do
          post "#{base_uri}/signin", params: invalid_credentials

          expect(response.status).to eq 400
        end

        it "returns not ok" do
          post "#{base_uri}/signin", params: invalid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          post "#{base_uri}/signin", params: invalid_credentials

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

        let(:invalid_credentials) { {email: "registered@api.com", password: "x"} }

        it "returns status code 403" do
          post "#{base_uri}/signin", params: invalid_credentials

          expect(response.status).to eq 403
        end

        it "returns not ok" do
          post "#{base_uri}/signin", params: invalid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          post "#{base_uri}/signin", params: invalid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "403 Forbidden"
        end
      end

      context "cannot with not registered email" do
        let(:valid_credentials) { {email: "new@tsks.api", password: "x"} }

        it "returns status code 404" do
          post "#{base_uri}/signin", params: valid_credentials

          expect(response.status).to eq 404
        end

        it "returns not ok" do
          post "#{base_uri}/signin", params: valid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          post "#{base_uri}/signin", params: valid_credentials

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "404 Not Found"
        end
      end

      # TODO: implement param type checking
      #context "cannot with invalid email" do
      #  let(:invalid_credentials) { {email: "invalid string", password: "x"} }

      #  it "returns status code 400" do
      #    post "#{base_uri}/signin", params: invalid_credentials

      #    expect(response.status).to eq 422
      #  end

      #  it "returns not ok" do
      #    post "#{base_uri}/signin", params: invalid_credentials

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["ok"]).to eq false
      #  end

      #  it "returns error message" do
      #    post "#{base_uri}/signin", params: invalid_credentials

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["message"]).to eq "422 Unprocessable Entity"
      #  end
      #end
    end
  end
end
