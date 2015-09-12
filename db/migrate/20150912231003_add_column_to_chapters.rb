class AddColumnToChapters < ActiveRecord::Migration
  def change
    add_column :chapters, :number, :integer, after: :book_id
  end
end
