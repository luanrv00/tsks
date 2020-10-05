require "jwt"

module V1
  class RegisterController < ApplicationController
    def create
      user = User.new register_params

      if user.save
        payload = {email: params[:email]}
        token = JWT.encode payload, nil, "none"
        render json: {status_code: 201, token: token, user_id: user.id},
                      status: :ok
      elsif user.errors.details[:email]
        render json: {status_code: 409}, status: :conflict
      end
    end

    private

    def register_params
      params.permit(:email, :password, :password_confirmation)
    end
  end
end
