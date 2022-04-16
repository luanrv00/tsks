require "jwt"

module V1
  class TsksController < ApplicationController
    def index
      if !request.headers.include? :authorization
        return render json: {ok: false}, status: :unauthorized
      end

      token = request.headers[:authorization].split(" ").last
      decoded = JWT.decode token, nil, false
      user = User.find_by_email decoded[0]["email"]

      if user
        tsks = user.tsks.all
        render json: {ok: true, tsks: tsks}, status: :ok
      else
        render json: {ok: false}, status: :forbidden
      end
    end

    def create
      if !request.headers.include? :authorization
        return render json: {ok: false}, status: :unauthorized
      end

      token = request.headers[:authorization].split(" ").last
      decoded = JWT.decode token, nil, false
      user = User.find_by_email(decoded[0]["email"])

      if user
        for tsk in params[:tsks]
          user.tsks.create({id: tsk[:id],
                            tsk: tsk[:tsk],
                            context: tsk[:context],
                            status: tsk[:status],
                            created_at: tsk[:created_at],
                            updated_at: tsk[:updated_at]})
        end

        render json: {ok: true, tsks: params[:tsks]}, status: :created
      else
        render json: {ok: false}, status: :forbidden
      end
    end

    def destroy
      if !request.headers.include? :authorization
        return render json: {ok: false}, status: :unauthorized
      end

      token = request.headers[:authorization].split(" ").last
      decoded = JWT.decode token, nil, false
      user = User.find_by_email decoded[0]["email"] if decoded[0]["email"]

      if !user
        return render json: {ok: false}, status: :forbidden
      end

      tsk = user.tsks.find params[:id]

      if tsk && tsk.destroy
        render json: {ok: true}, status: :ok
      end
    end
  end
end
