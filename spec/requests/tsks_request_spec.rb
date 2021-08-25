require 'rails_helper'

RSpec.describe "Tsks", type: :request do
  let(:base_uri) { "/v1" }
  let(:invalid_token) { "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImludmFsaWQifQ." }
  let(:valid_token) {
    "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSJ9."
  }

  describe "GET /tsks" do
    it "Returns the status code 200" do
      get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}
      expect(response.status).to eq 200
    end

    it "Returns tsks from a registered e-mail" do
      get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "tsks"
    end

    it "Returns the status code 403" do
      get "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}
      expect(response.status).to eq 403
    end

    it "Returns the status code 401" do
      get "#{base_uri}/tsks"
      expect(response.status).to eq 401
    end

    it "Returns ok equals true for success requests" do
      get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "ok"
      expect(parsed_body["ok"]).to eq true
    end

    it "Returns ok equals false for bad requests" do
      get "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body["ok"]).to eq false
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

    it "Returns the status code 201" do
      post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
                               params: {tsks: tsks}
      expect(response.status).to eq 201
    end

    it "Returns the status 403" do
      post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}
      expect(response.status).to eq 403
    end

    it "Returns the status 401" do
      post "#{base_uri}/tsks"
      expect(response.status).to eq 401
    end

    # TODO: fix environment error to enable the assertion below
    # it "Returns the created tsks for success requests" do
    #   post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
    #                            params: {tsks: tsks}
    #   parsed_body = JSON.parse response.body, symbolize_names: true
    #   expect(parsed_body["tsks"]).to eq tsks
    # end

    it "Returns ok equals true for success requests" do
      post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
                               params: {tsks: tsks}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "ok"
      expect(parsed_body["ok"]).to eq true
    end

    it "Returns ok equals false for bad requests" do
      post "#{base_uri}/tsks"
      parsed_body = JSON.parse response.body
      expect(parsed_body["ok"]).to eq false
    end
  end

  describe "DELETE /tsks/:id" do
    it "Returns the status 200" do
      u = User.find_by_email("registered@api.com")
      tsk = u.tsks.create!({tsk: "tsk"})
      delete "#{base_uri}/tsks/#{tsk[:id]}", headers: {authorization: "Bearer #{valid_token}"}
      expect(response.status).to eq 200
    end

    it "Returns the status 403" do
      delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{invalid_token}"}
      expect(response.status).to eq 403
    end

    it "Returns the status 401" do
      delete "#{base_uri}/tsks/fake-id"
      expect(response.status).to eq 401
    end

    it "Returns ok equals true for success responses" do
      u = User.find_by_email("registered@api.com")
      tsk = u.tsks.create!({tsk: "tsk"})
      delete "#{base_uri}/tsks/#{tsk[:id]}", headers: {authorization: "Bearer #{valid_token}"}
      parsed_body = JSON.parse response.body
      expect(parsed_body).to include "ok"
      expect(parsed_body["ok"]).to eq true
    end

    it "Returns ok equals false for bad requests" do
      delete "#{base_uri}/tsks/fake-id"
      parsed_body = JSON.parse response.body
      expect(parsed_body["ok"]).to eq false
    end
  end
end
