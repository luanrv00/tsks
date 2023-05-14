class Tsk < ApplicationRecord
  belongs_to :user
  validates :tsk, :context, :status, presence: true
end
