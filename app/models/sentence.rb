class Sentence < ActiveRecord::Base
  belongs_to :book
  belongs_to :chapter, foreign_key: :number
end
