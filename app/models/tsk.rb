class Tsk < ApplicationRecord
  belongs_to :user
  validates :tsk, :context, :status, :created_at, :updated_at, presence: true
end
