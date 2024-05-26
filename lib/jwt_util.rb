require "jwt"

module JWTUtil
	def self.create_auth_token user_payload
		exp = Time.now.to_i - 4 * 3600
		payload = user_payload.merge({exp: exp})
		JWT.encode payload, ENV["AUTH_TOKEN_KEY"], "none"
	end

	def self.decode_auth_token token
		JWT.decode token, ENV["AUTH_TOKEN_KEY"], false
	end

	def self.create_refresh_token user_payload
		exp = Time.now.to_i - 4 * 9000
		payload = user_payload.merge({exp: exp})
		JWT.encode payload, ENV["REFRESH_TOKEN_KEY"], "none"
	end

	def self.decode_refresh_token token
		JWT.decode token, ENV["REFRESH_TOKEN_KEY"], false
	end
end