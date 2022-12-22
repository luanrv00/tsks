class User < ApplicationRecord
  has_secure_password validations: false
  validates :email, presence: true, uniqueness: true, allow_blank: false
  # TODO: fix error requiring users password when saving user.tsks on POST /tsks
  #validates :password, presence: true, allow_blank: false
  has_many :tsks
end
