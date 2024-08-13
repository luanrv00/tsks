class AddDeletedAtToTsks < ActiveRecord::Migration[7.0]
  def change
    add_column :tsks, :deleted_at, :datetime
  end
end
