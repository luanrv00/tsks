require "#{Rails.root}/lib/jwt_util"

module V1
  class RefreshTokenController < ApplicationController
    def create
      if !cookies["refresh_token"]
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      begin
        decoded_refresh_token = JWTUtil.decode_refresh_token cookies["refresh_token"]

        if decoded_refresh_token
          user_email = decoded_refresh_token[0]["email"]
          user = User.find_by_email user_email
          
          if !user
            return render json: {ok: false,
                                 message: "404 Not Found"},
                                 status: :not_found
          else
            if user.refresh_token != cookies["refresh_token"]
              return render json: {ok: false,
                                   message: "401 Unauthorized"},
                                   status: :unauthorized
            else
              payload = {email: user_email}
              new_refresh_token = JWTUtil.create_refresh_token payload
              new_auth_token = JWTUtil.create_auth_token payload

              begin
                user.update_attribute(:refresh_token, new_refresh_token)

                cookies[:refresh_token] = {
                  value: new_refresh_token,
                  expires: 1.week.from_now,
                  httponly: true
                }
                return render json: {ok: true,
                                      message: "201 Created",
                                      auth_token: new_auth_token},
                                      status: :created
              rescue
                return render json: {ok: false,
                                      message: "500 Server Error"},
                                      status: :server_error
              end
            end

          end
        end
      rescue JWT::DecodeError
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end
    end
  end
end
