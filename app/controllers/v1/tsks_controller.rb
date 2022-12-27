require "jwt"

module V1
  class TsksController < ApplicationController
    def index
      if !request.headers.include? :authorization
        return render json: {ok: false,
                             message: "401 Unauthorized"},
                             status: :unauthorized
      end

      token = request.headers[:authorization].split(" ").last
      decoded = JWT.decode token, nil, false
      user = User.find_by_email decoded[0]["email"]

      if user
        tsks = user.tsks.all
        render json: {ok: true, tsks: tsks}, status: :ok

        # TODO: research about 403 handling
        #else
        #  render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
      end
    end

    # TODO: implement each Tsk required params error to respond 400
    # when review done of current data structure
    def create
      if !params["tsk"]
        return render json: {ok: false,
                             message: "400 Bad Request"},
                             status: :bad_request
      end

      if !request.headers.include? :authorization
        return render json: {ok: false,
                             message: "401 Unauthorized"},
                             status: :unauthorized
      end

      token = request.headers[:authorization].split(" ").last
      decoded = JWT.decode token, nil, false
      @user = User.find_by_email(decoded[0]["email"])

      if @user
        @user.tsks.create(tsk_params)
        # TODO: fix "password can't be blank" 422 error
        begin
          if @user.save!
            render json: {ok: true, tsk: @user.tsks.last}, status: :created
          end
        rescue ActiveRecord::RecordInvalid
          return render json: {ok: false, message: "400 Bad Request"},
            status: :bad_request
        end
      else
        # TODO: 403
        #  render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
      end
    end

    def destroy
      if !request.headers.include? :authorization
        return render json: {ok: false, message: "401 Unauthorized"},
          status: :unauthorized
      end

      token = request.headers[:authorization].split(" ").last
      decoded = JWT.decode token, nil, false
      user = User.find_by_email decoded[0]["email"] if decoded[0]["email"]

      # TODO: research cookies usage for checking session <> token validity
      #if !user
      #  return render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
      #end

      begin
        # NOTE: breaks with invalid token. should implement a better way of
        # getting/passing testing data or return 403 before this
        tsk = user.tsks.find params[:id]
      rescue ActiveRecord::RecordNotFound
          return render json: {ok: false, message: "404 Not Found"},
                               status: :not_found
      end

      if tsk && tsk.destroy
        return render json: {ok: true}, status: :no_content
      end
    end

    private

    def tsk_params
      params.require(:tsk).permit(:tsk, :context, :status, :user_id, :created_at, :updated_at)
    end
  end
end
