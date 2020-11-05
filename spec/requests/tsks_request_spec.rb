require 'rails_helper'

RSpec.describe "Tsks", type: :request do
  let(:base_uri) { "/v1" }
  let(:invalid_token) { "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImludmFsaWQifQ." }
  let(:token) {
    "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSJ9."
  }

  describe "GET /tsks" do
    it "Returns the status code 200 on body" do
      get "#{base_uri}/tsks", headers: {authorization: "Bearer #{token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "status_code"
      expect(parsed_body["status_code"]).to eq 200
    end

    it "Returns tsks from a registered e-mail" do
      get "#{base_uri}/tsks", headers: {authorization: "Bearer #{token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "tsks"
    end

    it "Returns the status code 403 on body" do
      get "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 403
    end

    it "Returns the status code 401 on body" do
      get "#{base_uri}/tsks"
      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 401
    end
  end

  describe "POST /tsks" do
    let(:tsks) {
      [{id: 1,
        tsk: "t",
        context: "Inbox",
        done: 0,
        created_at: nil,
        updated_at: nil}]
    }

    it "Returns the status code 201 on body" do
      post "#{base_uri}/tsks", headers: {authorization: "Bearer #{token}"},
                           params: {tsks: tsks}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "status_code"
      expect(parsed_body["status_code"]).to be 201
    end

    it "Returns the status 403 on body" do
      post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 403
    end

    it "Returns the status 401 on body" do
      post "#{base_uri}/tsks"
      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 401
    end
  end

  describe "DELETE /tsks/:id" do
    it "Returns the status 200" do
      u = User.find_by_email("registered@api.com")
      tsk = u.tsks.create!({tsk: "tsk"})
      delete "#{base_uri}/tsks/#{tsk[:id]}", headers: {authorization: "Bearer #{token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 200
    end

    it "Returns the status 403" do
      delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{invalid_token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 403
    end

    it "Returns the status 401" do
      delete "#{base_uri}/tsks/fake-id"
      parsed_body = JSON.parse response.body
      expect(parsed_body["status_code"]).to eq 401
    end
  end
end
