class CreateTsks < ActiveRecord::Migration[6.0]
  def change
    create_table :tsks do |t|
      t.string :tsk
      t.string :context, default: "inbox"
      t.integer :done, default: 0
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
