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

      payload = {email: params[:email]}
      token = JWT.encode payload, nil, "none"
      user = User.new register_params
      user.auth_token = token

      begin
        if user.save!
          render json: {ok: true,
                        auth_token: token,
                        user: user},
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
