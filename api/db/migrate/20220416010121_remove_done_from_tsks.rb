class RemoveDoneFromTsks < ActiveRecord::Migration[6.1]
  def change
    remove_column :tsks, :done, :boolean
  end
end
