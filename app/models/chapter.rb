class Chapter < ActiveRecord::Base
  has_many :sentences, primary_key: :number
  belongs_to :book
end
