require "#{Rails.root}/lib/jwt_util"

module V1
  class TsksController < ApplicationController
    def index
      if !request.headers.include? :authorization
        return render json: {ok: false,
                             message: "401 Unauthorized"},
                             status: :unauthorized
      end

      auth_token = request.headers[:authorization].split(" ").last
      decoded = JWTUtil.decode_auth_token auth_token
      if !decoded
        return render json: {ok: false,
                             message: "401 Unauthorized"},
                             status: :unauthorized
      end

      user = User.find_by_email decoded[0]["email"]
      if user
        tsks = user.tsks.all
        available_tsks = tsks.select {|tsk| tsk.deleted_at == nil}
        render json: {ok: true,
                      tsks: available_tsks,
                      message: "200 Success"},
                      status: :ok
      else
        render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
      end
    end

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

      auth_token = request.headers[:authorization].split(" ").last
      decoded = JWTUtil.decode_auth_token auth_token
      if !decoded
        return render json: {ok: false,
                             message: "401 Unauthorized"},
                             status: :unauthorized
      end

      user = User.find_by_email(decoded[0]["email"])
      if user
        tsk = user.tsks.build tsk_params
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

      auth_token = request.headers[:authorization].split(" ").last
      decoded = JWTUtil.decode_auth_token auth_token
      if !decoded
        return render json: {ok: false,
                             message: "401 Unauthorized"},
                             status: :unauthorized
      end

      user = User.find_by_email(decoded[0]["email"])
      if user
        begin
          tsk = user.tsks.find params[:id]

          if tsk
            begin
              if tsk.update tsk_params
                return render json: {ok: true,
                                     tsk: tsk,
                                     message: "200 Success"},
                                     status: :ok
              end
            rescue
              return render json: {ok: false,
                                  message: "500 Internal Server Error"},
                                  status: :internal_server_error
            end
          end
        rescue ActiveRecord::RecordNotFound
          return render json: {ok: false,
                              message: "404 Not Found"},
                              status: :not_found
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

      auth_token = request.headers[:authorization].split(" ").last
      decoded = JWTUtil.decode_auth_token auth_token
      if !decoded
        return render json: {ok: false,
                             message: "401 Unauthorized"},
                             status: :unauthorized
      end

      user = User.find_by_email decoded[0]["email"] if decoded[0]["email"]
      if !user
        return render json: {ok: false, message: "403 Forbidden"}, status: :forbidden
      end

      begin
        # NOTE: breaks with invalid token. should implement a better way of
        # getting/passing testing data or return 403 before this
        tsk = user.tsks.find params[:id]

        if tsk
          begin
            if tsk.update(deleted_at: Time.now)
              return render json: {ok: true}, status: :ok
            end
          rescue
            return render json: {ok: false,
                                 message: "500 Internal Server Error"},
                                 status: :internal_server_error
          end
        end
      rescue ActiveRecord::RecordNotFound
          return render json: {ok: false, message: "404 Not Found"},
                               status: :not_found
      end
    end

    private

    def tsk_params
      params.require(:tsk).permit(:tsk, :context, :status)
    end
  end
end
