require "jwt"

module V1
  class LoginController < ApplicationController
    def create
      user = User.find_by_email params[:email]

      if user && user.authenticate(params[:password])
        payload = {email: params[:email]}
        token = JWT.encode payload, nil, "none"
        render json: {ok: true,
                      token: token,
                      user_id: user.id},
                      status: :ok
      else
        render json: {ok: false}, status: :forbidden
      end
    end
  end
end
