require "jwt"

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

      auth_token = create_auth_token
      user = User.new register_params
      user.refresh_token = create_refresh_token

      begin
        if user.save!
          render json: {ok: true,
                        message: "201 Created",
                        user: user,
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

    def create_auth_token
      payload = {email: params[:email]}
      JWT.encode payload, nil, "none"
    end

    def create_refresh_token
      payload = {email: params[:email]}
      JWT.encode payload, nil, "none"
    end
  end
end
