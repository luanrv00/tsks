require "#{Rails.root}/lib/jwt_util"

module V1
  class SignupController < ApplicationController
    def create
      if !params["email"] || !params["password"]
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      if User.exists?(email: params['email'])
        return render json: {ok: false,
                             message: "409 Conflict"},
                             status: :conflict
      end

      user = User.new register_params
      auth_token_payload = {email: params[:email]}
      auth_token = JWTUtil.create_auth_token auth_token_payload
      refresh_token = JWTUtil.create_refresh_token auth_token_payload
      user.refresh_token = refresh_token

      begin
        if user.save!
          cookies[:refresh_token] = {
            value: refresh_token,
            expires: 1.week.from_now,
            httponly: true,
          }

          user_info = user.attributes
          user_info.delete("refresh_token")

          render json: {ok: true,
                        message: "201 Created",
                        user: user_info,
                        auth_token: auth_token},
                        status: :created
        else
          return render json: {ok: false,
                               message: "422 Unprocessable Entity"},
                               status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordInvalid
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end
    end

    private

    def register_params
      params.permit(:email, :password)
    end
  end
end
