class DictatesController < ApplicationController
  def play
    gon.sentences = Sentence.limit(1000)
  end
end
