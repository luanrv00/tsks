require "jwt"

module V1
  class LoginController < ApplicationController
    def create
      if !params["email"] || !params["password"]
        return render json: {ok: false, message: "Params email and password are required"}
      end

      user = User.find_by_email params[:email]

      if user && user.authenticate(params[:password])
        payload = {email: params[:email]}
        token = JWT.encode payload, nil, "none"
        render json: {ok: true,
                      token: token,
                      user_id: user.id},
                      status: :ok
      else
        render json: {ok: false, message: "Permission denied"}, status: :forbidden
      end
    end
  end
end
