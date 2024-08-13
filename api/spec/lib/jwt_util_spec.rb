require "rails_helper"
require_relative "#{Rails.root}/lib/jwt_util"

describe JWTUtil do
    payload = {email: "auth_token@test.com"}

    it "creates auth token with expiration time" do
        auth_token = JWTUtil.create_auth_token payload
        generated_auth_token = JWTUtil.decode_auth_token auth_token
        expect(generated_auth_token[0]["exp"].class).to eq Integer
    end

    it "create refresh token with expiration time" do
        refresh_token = JWTUtil.create_refresh_token payload
        generated_refresh_token = JWTUtil.decode_refresh_token refresh_token
        expect(generated_refresh_token[0]["exp"].class).to eq Integer
    end
end