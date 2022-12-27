require "jwt"

module V1
  class SigninController < ApplicationController
    def create
      if !params["email"] || !params["password"]
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      # TODO: implement email type checking

      user = User.find_by_email params[:email]

      if user
        if user.authenticate(params[:password])
          payload = {email: params[:email]}
          token = JWT.encode payload, nil, "none"

          # TODO: verify if auth_token must exist on storage in this step
          #if !user.auth_token
          #  user.auth_token = token
          #  user.save!
          #end

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
