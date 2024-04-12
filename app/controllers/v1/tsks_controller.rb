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
        render json: {ok: true,
                      tsks: tsks,
                      message: "200 Success"},
                      status: :ok
      else
        render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
      end
    end

    # TODO: implement each Tsk required params error to respond 400
    # when review done of current data structure
    def create
      if !params[:tsk]
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
      user = User.find_by_email(decoded[0]["email"])

      if user
        tsk = user.tsks.build tsk_params
        # TODO: (review if still need this fix) fix "password can't be blank" 422 error
        begin
          if tsk.save!
            return render json: {ok: true, 
                                 tsk: user.tsks.last,
                                 message: "201 Created"}, 
                                 status: :created
          else
            return render json: {ok: false,
                                message: "400 Bad Request"},
                                status: :bad_request
          end
        rescue ActiveRecord::RecordInvalid => e
          return render json: {ok: false,
                               message: "400 Bad Request"},
                               status: :bad_request
        end
      else
        return render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
      end
    end

    # TODO: write tests
    def update
      if !params[:tsk]
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
      user = User.find_by_email(decoded[0]["email"])

      if user
        tsk = user.tsks.find params[:id]

        if tsk
          begin
            if tsk.update tsk_params
              return render json: {ok: true, tsk: tsk}, status: :ok
            end
          rescue
            return render json: {ok: false,
                                message: "500 Internal Server Error"},
                                status: :internal_server_error
          end
        end
      else
        return render json: {ok: false,
                             message: "403 Forbidden"},
                             status: :forbidden
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
      if !user
        return render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
      end

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
      params.require(:tsk).permit(:tsk, :context, :status, :created_at, :updated_at)
    end
  end
end
