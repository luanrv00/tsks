class Tsk < ApplicationRecord
  belongs_to :user
  validates :tsk, :context, presence: true
end
