class DictatesController < ApplicationController
  def play
    gon.sentences = Sentence.all
  end
end
