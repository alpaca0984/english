class Chapter < ActiveRecord::Base
  has_many :sentences
  belongs_to :book
end
