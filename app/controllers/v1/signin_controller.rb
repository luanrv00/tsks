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
          user.refresh_token = create_refresh_token
          auth_token = create_auth_token

          return render json: {ok: true,
                               message: "200 Success",
                               user: user,
                               auth_token: auth_token},
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
