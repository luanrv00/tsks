require "email_validator"
require "#{Rails.root}/lib/jwt_util"

module V1
  class SigninController < ApplicationController
    def create
      if !params["email"] || !params["password"]
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      isEmailValid = is_email_valid params["email"]
      if !isEmailValid
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      user = User.find_by_email params[:email]

      if user
        if user.authenticate(params[:password])
          auth_token_payload = {email: params[:email]}
          auth_token = JWTUtil.create_auth_token auth_token_payload
          refresh_token = JWTUtil.create_refresh_token auth_token_payload
          user.refresh_token = refresh_token

          cookies[:refresh_token] = {
            value: refresh_token,
            expires: 1.week.from_now,
            httponly: true,
          }

          user_info = user.attributes
          user_info.delete("refresh_token")

          return render json: {ok: true,
                               message: "200 Success",
                               user: user_info,
                               auth_token: auth_token},
                               status: :ok
        else
          return render json: {ok: false, message: "401 Unauthorized"}, status: :unauthorized
        end
      else
        return render json: {ok: false, message: '404 Not Found'}, status: :not_found
      end
    end

    private

    def is_email_valid email
      EmailValidator.valid? email
    end
  end
end
