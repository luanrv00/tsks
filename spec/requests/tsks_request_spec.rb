require 'rails_helper'

RSpec.describe "Tsks", type: :request do
  let(:base_uri) { "/v1" }
  let(:invalid_token) { "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImludmFsaWQifQ." }
  let(:valid_token) {
    "eyJhbGciOiJub25lIn0.eyJlbWFpbCI6InJlZ2lzdGVyZWRAYXBpLmNvbSJ9."
  }

  describe "GET /tsks" do
    context "get tsks from user" do
      it "returns status code 200" do
        get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}
        expect(response.status).to eq 200
      end

      it "returns tsks from user" do
        get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}
        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "tsks"
        # TODO: expect(parsed_body["tsks"]).to eq tsks data structure
      end

      it "returns ok" do
        get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end
    end

    context "Error 401 Unauthorized" do
      it "returns status code 401" do
        get "#{base_uri}/tsks"
        expect(response.status).to eq 401
      end

      it "returns not ok" do
        get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end
    end

    context "Error 403 Forbidden" do
      it "returns status code 403" do
        get "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"}
        expect(response.status).to eq 403
      end

      it "returns not ok" do
        get "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"}
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end
    end
  end

  describe "POST /tsks" do
    context "create a tsk" do
      let(:tsk) {
        {id: 1,
          tsk: "t",
          context: "Inbox",
          status: 'todo',
          created_at: nil,
          updated_at: nil}
      }

      it "returns status code 201" do
        post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
                                 params: {tsk: tsk}
        expect(response.status).to eq 201
      end

      it "returns the tsk" do
        post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
                                 params: {tsk: tsk}

        parsed_body = JSON.parse response.body
        expect(parsed_body).to include "tsk"
        # TODO: expect(parsed_body["tsk"]).to eq tsk data structure
      end

      it "returns ok" do
        post "#{base_uri}/tsks", headers: {authorization: "Bearer #{valid_token}"},
                                 params: {tsk: tsk}

        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq true
      end
    end

    context "Error 400 Bad Request" do
      it "returns status 400" do
        post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"},
                                 params: {tsk: false}
        expect(response.status).to eq 400
      end

      it "returns not ok" do
        post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"},
                                 params: {tsk: false}

        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "Error 401 Unauthorized" do
      it "Returns the status 401" do
        post "#{base_uri}/tsks"
        expect(response.status).to eq 401
      end

      it "returns not ok" do
        post "#{base_uri}/tsks"
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    # TODO: research about cookies usage for testing 403
    context "Error 403 Forbidden" do
      it "returns status 403" do
        post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"},
                                 params: {tsk: tsk}
        expect(response.status).to eq 403
      end

      it "returns not ok" do
        post "#{base_uri}/tsks", headers: {authorization: "Bearer #{invalid_token}"},
                                 params: {tsk: tsk}
        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

  describe "DELETE /tsks/:id" do
    context "delete a tsk" do
      it "returns status 204" do
        u = User.find_by_email("registered@api.com")
        tsk = u.tsks.create!({tsk: "tsk"})
        delete "#{base_uri}/tsks/#{tsk[:id]}", headers: {authorization: "Bearer #{valid_token}"}

        expect(response.status).to eq 204
      end
    end

    context "Error 403 Forbidden" do
      it "returns status 403" do
        delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{invalid_token}"}

        expect(response.status).to eq 403
      end

      it "returns not ok" do
        delete "#{base_uri}/tsks/fake-id", headers: {authorization: "Bearer #{invalid_token}"}

        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end

    context "401 Unauthorized" do
      it "Returns the status 401" do
        delete "#{base_uri}/tsks/fake-id"
        expect(response.status).to eq 401
      end

      it "returns not ok" do
        delete "#{base_uri}/tsks/fake-id"

        parsed_body = JSON.parse response.body
        expect(parsed_body["ok"]).to eq false
      end
    end
end
