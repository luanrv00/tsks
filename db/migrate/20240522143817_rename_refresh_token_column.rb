class RenameRefreshTokenColumn < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :auth_token, :refresh_token
  end
end
