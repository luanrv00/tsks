require 'rails_helper'

# TODO: implement PUT test cases (plan from gist)
RSpec.describe "Tsks", type: :request do
  let(:auth_token) {
    "Bearer eyJhbGciOiJub25lIn0.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSJ9."
  }
  let(:invalid_auth_token) {
    "Bearer eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImJAZy5nIn0."
  }
  let(:api_endpoint) { "/v1/tsks" }
  let(:api_headers) { {authorization: auth_token} }
  let(:invalid_api_headers) { {authorization: invalid_auth_token} }
  let(:tsk) {
    {tsk: "t",
     context: "inbox",
     status: "todo"}
  }
  let(:tsks) {
    [tsk]
  }

  describe "GET /tsks" do
    context "cannot without authentication token" do
      before :each do
        get api_endpoint
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

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "403 Forbidden"
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

      it "returns ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end

      it "returns tsks" do
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "tsks"
        # TODO: expect(parsed_body["tsks"]).to eq tsks data structure
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

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "401 Unauthorized"
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

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "403 Forbidden"
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

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "400 Bad Request"
      end
    end

    context "cannot without valid tsk" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      let(:invalid_tsk) {
        {id: 1}
      }

      before :each do
        post api_endpoint, headers: api_headers, params: {tsk: invalid_tsk}
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

    # TODO: fix 400 error - invalid tsk when sent data structure is correct
    #context "create succesfully" do
    #  before :all do
    #    Rails.application.load_seed
    #  end

    #  after :all do
    #    DatabaseCleaner.clean
    #  end

    #  before :each do
    #    post api_endpoint, headers: api_headers, params: {tsk: tsk}
    #  end

    #  it "returns status code 201" do
    #    expect(response.status).to eq 201
    #  end

    #  it "returns ok" do
    #    parsed_body = JSON.parse response.body
    #    expect(parsed_body["ok"]).to eq true
    #  end

    #  it "returns tsk" do
    #    parsed_body = JSON.parse response.body
    #    expect(parsed_body).to include "tsk"
    #    # TODO: expect(parsed_body["tsks"]).to eq tsks data structure
    #  end
    #end
  end

  describe "DELETE /tsks/:id" do
    context "cannot without authentication token" do
      before :each do
        delete "#{api_endpoint}/fake-id"
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

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "403 Forbidden"
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

      it "returns not ok" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end

      it "returns error message" do
        parsed_body = JSON.parse response.body
        expect(parsed_body["message"]).to eq "404 Not Found"
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
        tsk = Tsk.find_by({id: 012})
        delete "#{api_endpoint}/#{tsk.id}", headers: api_headers

        expect(response.status).to eq 204
      end
    end
  end
end
