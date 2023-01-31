require 'rails_helper'

RSpec.describe "Tsks", type: :request do
  let(:tsks_endpoint) { "/v1/tsks" }
  let(:auth_token) {
    "Bearer eyJhbGciOiJub25lIn0.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSJ9."
  }
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
        get tsks_endpoint
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

    context "get succesfully" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        get tsks_endpoint, headers: {authorization: auth_token}
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
    # TODO: verify if need pass params
    context "cannot without authentication token" do
      before :each do
        post tsks_endpoint, params: {tsk: tsk}
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

    context "cannot without valid params" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      let(:invalid_tsk) {
        {id: 1,
          t: "t",
          ctx: "Inbox",
          stats: 'todo',
          created_at: nil,
          updated_at: nil}
      }

      before :each do
        post tsks_endpoint, headers: {authorization: auth_token}, params: {tsk: invalid_tsk}
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
    #    post tsks_endpoint, headers: {authorization: auth_token}, params: {tsk: tsk}
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
        delete "#{tsks_endpoint}/fake-id"
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

    context "cannot unexistent tsk" do
      before :all do
        Rails.application.load_seed
      end

      after :all do
        DatabaseCleaner.clean
      end

      before :each do
        delete "#{tsks_endpoint}/fake-id", headers: {authorization: auth_token}
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
        tsk = Tsk.find_by({id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"})
        delete "#{tsks_endpoint}/#{tsk.id}", headers: {authorization: auth_token}

        expect(response.status).to eq 204
      end
    end
  end
end
