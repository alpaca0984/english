class AddColumnToSentences < ActiveRecord::Migration
  def change
    add_column :sentences, :number, :integer, after: :chapter_id
  end
end
