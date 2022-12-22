require 'rails_helper'

RSpec.describe "Tsks", type: :request do
  let(:base_uri) { "/v1" }
  let(:invalid_token) { "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImludmFsaWQifQ." }
  let(:valid_token) {
    "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSJ9."
  }

  describe "GET /tsks" do
    context "get tsks" do
      context "get tsks succesfully" do
        before :all do
          Rails.application.load_seed
        end

        after :all do
          DatabaseCleaner.clean
        end

        it "returns status code 200" do
          get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}

          expect(response.status).to eq 200
        end

       it "returns ok" do
          get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq true
        end

        it "returns tsks" do
          get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}

          parsed_body = JSON.parse response.body
          expect(parsed_body).to include "tsks"
          # TODO: expect(parsed_body["tsks"]).to eq tsks data structure
        end
      end

      context "cannot without authentication token" do
        it "returns status code 401" do
          get "#{base_uri}/tsks"
          expect(response.status).to eq 401
        end

        it "returns not ok" do
          get "#{base_uri}/tsks"
          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          get "#{base_uri}/tsks"

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "401 Unauthorized"
        end
      end

      # TODO: research about 403 handling
      #context "cannot with invalid credentials" do
      #  it "returns status code 403" do
      #    get "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}
      #    expect(response.status).to eq 403
      #  end

      #  it "returns not ok" do
      #    get "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}
      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["ok"]).to eq false
      #  end

      #  it "returns error message" do
      #    get "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["message"]).to eq "403 Forbidden"
      #  end
      #end
    end
  end

  describe "POST /tsks" do
    context "create tsks succesfully" do
      let(:tsks) {
        [{id: 1,
          tsk: "t",
          context: "Inbox",
          status: 'todo',
          created_at: nil,
          updated_at: nil}]
      }

      context "create tsks" do
        before :all do
          Rails.application.load_seed
        end

        after :all do
          DatabaseCleaner.clean
        end

        it "returns status code 201" do
          post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
            params: {tsks: tsks}

          expect(response.status).to eq 201
        end

        it "returns ok" do
          post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
            params: {tsks: tsks}

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq true
        end

        it "returns tsks" do
          post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
            params: {tsks: tsks}

          parsed_body = JSON.parse response.body
          expect(parsed_body).to include "tsks"
          # TODO: expect(parsed_body["tsks"]).to eq tsks data structure
        end
      end

      #context "cannot without params" do
      #  it "returns status code 400" do
      #    post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"},
      #      params: {}

      #    expect(response.status).to eq 400
      #  end

      #  it "returns not ok" do
      #    post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"},
      #      params: {}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["ok"]).to eq false
      #  end

      #  it "returns error message" do
      #    post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"},
      #      params: {}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["message"]).to eq "400 Bad Request"
      #  end
      #end

      # TODO: verify if need pass params
      #context "cannot without authentication token" do
      #  it "returns status code 401" do
      #    post "#{base_uri}/tsks", params: {tsks: tsks}

      #    expect(response.status).to eq 401
      #  end

      #  it "returns not ok" do
      #    post "#{base_uri}/tsks", params: {tsks: tsks}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["ok"]).to eq false
      #  end

      #  it "returns error message" do
      #    post "#{base_uri}/tsks", params: {tsks: tsks}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["message"]).to eq "401 Unauthorized"
      #  end
      #end

      # TODO: implement 403 error handling

      # TODO: create issued params structure
      #context "cannot without valid params" do
      #  it "returns status code 422" do
      #    post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
      #      params: {tsks: false}

      #    expect(response.status).to eq 422
      #  end

      #  it "returns not ok" do
      #    post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
      #      params: {tsks: false}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["ok"]).to eq false
      #  end

      #  it "returns error message" do
      #    post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
      #      params: {tsks: false}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["message"]).to eq "422 Unprocessable Entity"
      #  end
      #end
    end
  end

  describe "DELETE /tsks/:id" do
    context "delete tsk" do
      context "delete tsk succesfully" do
        before :all do
          Rails.application.load_seed
        end

        after :all do
          DatabaseCleaner.clean
        end

        it "returns status code 204" do
          tsk = Tsk.find_by({id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"})
          delete "#{base_uri}/tsks/#{tsk.id}", headers: {authorization: "Bearer #{valid_token}"}

          expect(response.status).to eq 204
        end
      end

      context "cannot without authentication token" do
        it "returns status code 401" do
          delete "#{base_uri}/tsks/fake-id"

          expect(response.status).to eq 401
        end

        it "returns not ok" do
          delete "#{base_uri}/tsks/fake-id"

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          delete "#{base_uri}/tsks/fake-id"

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "401 Unauthorized"
        end
      end

      #context "cannot without valid credentials" do
      #  it "returns status code 403" do
      #    delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{invalid_token}"}

      #    expect(response.status).to eq 403
      #  end

      #  it "returns not ok" do
      #    delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{invalid_token}"}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["ok"]).to eq false
      #  end

      #  it "returns error message" do
      #    delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{invalid_token}"}

      #    parsed_body = JSON.parse response.body
      #    expect(parsed_body["message"]).to eq "403 Forbidden"
      #  end
      #end

      context "cannot delete unexistent tsk" do
        before :all do
          Rails.application.load_seed
        end

        after :all do
          DatabaseCleaner.clean
        end

        it "returns status code 404" do
          delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{valid_token}"}

          expect(response.status).to eq 404
        end

        it "returns not ok" do
          delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{valid_token}"}

          parsed_body = JSON.parse response.body
          expect(parsed_body["ok"]).to eq false
        end

        it "returns error message" do
          delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{valid_token}"}

          parsed_body = JSON.parse response.body
          expect(parsed_body["message"]).to eq "404 Not Found"
        end
      end
    end
  end
end
