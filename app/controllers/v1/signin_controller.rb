require "jwt"

module V1
  class SigninController < ApplicationController
    def create
      # TODO: implement param type checking
      if !params["email"] || !params["password"]
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      user = User.find_by_email params[:email]

      if user
        if user.authenticate(params[:password])
          # TODO: get token from db, previously saved on signup
          payload = {email: params[:email]}
          token = JWT.encode payload, nil, "none"
          render json: {ok: true,
                        auth_token: token,
                        user: user},
                        status: :ok
        else
          render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
        end
      else
        render json: {ok: false, message: '404 Not Found'}, status: :not_found
      end
    end
  end
end
