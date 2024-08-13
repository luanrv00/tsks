class AddAuthTokenToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :auth_token, :string
  end
end
