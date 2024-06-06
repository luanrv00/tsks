require 'rails_helper'

RSpec.describe "Tsks", type: :request do
  let(:auth_token) {
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSIsImV4cCI6MTcxNzY0MDM3OH0.CO1jVK0DdxSXOul979-v4k1WhGRni-6b1ePbHnQ5B8Q"
  }
  let(:invalid_auth_token) {
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFAYS5hYWEiLCJleHAiOjE3MTc2NDA3NTV9.C2nYuDzOe4JjF-VhcyMzvOw3h2ylMms0fS8GkqXU790"
  }
  let(:api_endpoint) { "/v1/tsks" }
  let(:api_headers) { {authorization: auth_token} }
  let(:invalid_api_headers) { {authorization: invalid_auth_token} }
  let(:tsk) {
    {tsk: "t",
     context: "inbox",
     status: "todo",
     created_at: "2024-04-09 22:06:52.454969000 +0000",
     updated_at: "2024-04-09 22:06:52.454969000 +0000"}
  }
  let(:tsks) {
    [tsk]
  }
  let(:invalid_tsk) { nil }
  let(:valid_tsk_id) { 13 }

  describe "GET /tsks" do
    context "cannot without authentication token" do
      before :each do
        get api_endpoint
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

    context "cannot without valid authentication token" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        get api_endpoint, headers: invalid_api_headers
      end

      it "returns status code 403" do
        expect(response.status).to eq 403
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "403 Forbidden"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "get succesfully" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        get api_endpoint, headers: api_headers
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

      it "returns tsks" do
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "tsks"
        # TODO: expect(parsed_body["tsks"]).to eq tsks data structure
      end

      # TODO: write test after implemented data structure verification
      # currently we only verify if "tsks" is included as response 
      # and should verify for complete data structure returned
      # as mentioned as others todos notes
      it "returns only not deleted tsks" do
      end
    end
  end

  describe "POST /tsks" do
    context "cannot without authentication token" do
      before :each do
        post api_endpoint, params: {tsk: tsk}
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

    context "cannot without valid authentication token" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post api_endpoint, headers: invalid_api_headers, params: {tsk: tsk}
      end

      it "returns status code 403" do
        expect(response.status).to eq 403
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "403 Forbidden"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "cannot without tsk" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post api_endpoint, headers: api_headers, params: {}
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

    context "cannot without valid tsk" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post api_endpoint, headers: api_headers, params: {tsk: invalid_tsk}
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

    context "create succesfully" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        post api_endpoint, headers: api_headers, params: {tsk: tsk}
      end

      it "returns status code 201" do
        expect(response.status).to eq 201
      end

      it "returns message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "201 Created"
      end

      it "returns ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end

      it "returns tsk" do
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "tsk"
        # TODO: expect(parsed_body["tsks"]).to eq tsks data structure
      end
    end
  end

  describe "DELETE /tsks/:id" do
    context "cannot without authentication token" do
      before :each do
        delete "#{api_endpoint}/fake-id"
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

    context "cannot without valid authentication token" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        get api_endpoint, headers: invalid_api_headers
      end

      it "returns status code 403" do
        expect(response.status).to eq 403
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "403 Forbidden"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "cannot without valid id" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        delete "#{api_endpoint}/fake-id", headers: api_headers
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

    context "delete succesfully" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      it "returns status code 204" do
        tsk = Tsk.find_by({id: valid_tsk_id})
        delete "#{api_endpoint}/#{tsk.id}", headers: api_headers

        expect(response.status).to eq 204
      end
    end
  end

  describe "PUT /tsks/:id" do
    context "cannot without authentication token" do
      before :each do
        put "#{api_endpoint}/fake-id", params: {tsk: tsk}
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

    context "cannot without valid authentication token" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        put "#{api_endpoint}/fake-id", params: {tsk: tsk},
                                       headers: invalid_api_headers
      end

      it "returns status code 403" do
        expect(response.status).to eq 403
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "403 Forbidden"
      end

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "cannot without tsk" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        put "#{api_endpoint}/fake-id", headers: api_headers
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

    context "cannot without valid tsk" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        put "#{api_endpoint}/#{valid_tsk_id}", headers: api_headers,
                                               params: {tsk: invalid_tsk}
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

    context "cannot unexistent tsk" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        put "#{api_endpoint}/fake-id", headers: api_headers,
                                       params: {tsk: tsk}
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

    context "put succesfully " do
      before :all do
        Rails.application.load_seed
      end
      
      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        put "#{api_endpoint}/#{valid_tsk_id}", headers: api_headers,
                                               params: {tsk: tsk}
      end

      it "returns status code 200" do
        expect(response.status).to eq 200
      end

      it "returns success message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "200 Success"
      end

      it "returns ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end

      # TODO: change test to check deep tsk properties
      # (e.g. tsk.to eq tsk)
      it "returns tsk" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["tsk"]).to be_truthy
      end
    end
  end
end