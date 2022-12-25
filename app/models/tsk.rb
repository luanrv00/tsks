class Tsk < ApplicationRecord
  belongs_to :user
  validates :tsk, :status, presence: true
end
