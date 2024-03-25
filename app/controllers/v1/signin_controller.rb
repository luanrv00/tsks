require "jwt"
require "email_validator"

module V1
  class SigninController < ApplicationController
    def create
      if !params["email"] || !params["password"]
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      isEmailValid = is_email_valid params["email"]
      if !isEmailValid
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      user = User.find_by_email params[:email]

      if user
        if user.authenticate(params[:password])
          payload = {email: params[:email]}
          auth_token = user.auth_token

          if !auth_token
            return render json: {ok: false, message: "500 Internal Server Error"}, status: :internal_server_error
          end

          return render json: {ok: true,
                               message: "200 Success",
                               user: user},
                               status: :ok
        else
          return render json: {ok: false, message: "401 Unauthorized"}, status: :unauthorized
        end
      else
        return render json: {ok: false, message: '404 Not Found'}, status: :not_found
      end
    end

    private

    def is_email_valid email
      EmailValidator.valid? email
    end
  end
end
