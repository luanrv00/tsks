require "jwt"

module V1
  class RegisterController < ApplicationController
    def create
      user = User.new register_params

      if user.save
        payload = {email: params[:email]}
        token = JWT.encode payload, nil, "none"
        render json: {ok: true,
                      token: token,
                      user_id: user.id},
                      status: :created
      elsif user.errors.details[:email]
        render json: {ok: false}, status: :conflict
      end
    end

    private

    def register_params
      params.permit(:email, :password)
    end
  end
end
