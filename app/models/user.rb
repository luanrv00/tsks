class User < ApplicationRecord
  has_secure_password validations: false
  validates_uniqueness_of :email
  has_many :tsks
end
