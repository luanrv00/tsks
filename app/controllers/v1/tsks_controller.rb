require "jwt"

module V1
  class TsksController < ApplicationController
    def index
      if !request.headers.include? :authorization
        return render json: {status_code: 401}, status: :unauthorized
      end

      token = request.headers[:authorization].split(" ").last
      decoded = JWT.decode token, nil, false
      user = User.find_by_email decoded[0]["email"]

      if user
        tsks = user.tsks.all
        render json: {status_code: 200, tsks: tsks}, status: :ok
      else
        render json: {status_code: 403}, status: :forbidden
      end
    end

    def create
      if !request.headers.include? :authorization
        return render json: {status_code: 401}, status: :unauthorized
      end

      token = request.headers[:authorization].split(" ").last
      decoded = JWT.decode token, nil, false
      user = User.find_by_email(decoded[0]["email"])

      if user
        for tsk in params[:tsks]
          user.tsks.create({id: tsk[:id],
                            tsk: tsk[:tsk],
                            context: tsk[:context],
                            done: tsk[:done],
                            created_at: tsk[:created_at],
                            updated_at: tsk[:updated_at]})
        end

        render json: {status_code: 201}, status: :created
      else
        render json: {status_code: 403}, status: :forbidden
      end
    end
  end
end
