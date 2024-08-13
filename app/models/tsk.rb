class Tsk < ApplicationRecord
  belongs_to :user
  validates :tsk, presence: true
end
