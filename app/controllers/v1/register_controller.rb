require "jwt"

module V1
  class RegisterController < ApplicationController
    def create
      if User.exists?(email: params['email'])
        return render json: {ok: false, message: "E-mail already registered"}, status: :conflict
      end

      user = User.new register_params

      if user.save
        payload = {email: params[:email]}
        token = JWT.encode payload, nil, "none"
        render json: {ok: true,
                      token: token,
                      user_id: user.id},
                      status: :created
      else
        return render json: {ok: false, message: "Params email and password are required"}, status: :bad_request
      end
    end

    private

    def register_params
      params.permit(:email, :password)
    end
  end
end
