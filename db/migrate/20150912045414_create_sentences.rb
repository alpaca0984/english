class CreateSentences < ActiveRecord::Migration
  def change
    create_table :sentences do |t|
      t.integer :book_id
      t.integer :chapter_id
      t.string :japanese
      t.string :english

      t.timestamps null: false
    end
  end
end
