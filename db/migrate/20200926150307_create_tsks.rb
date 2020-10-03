class CreateTsks < ActiveRecord::Migration[6.0]
  def change
    create_table :tsks, id: :uuid do |t|
      t.string :tsk
      t.string :context, default: "Inbox"
      t.integer :done, default: 0
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
