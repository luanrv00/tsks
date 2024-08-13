class ChangeTsksDefaultStatus < ActiveRecord::Migration[7.0]
  def change
    change_column_default(:tsks, :status, 'todo')
  end
end
