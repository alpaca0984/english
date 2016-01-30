class DictatesController < ApplicationController
  def play
    gon.sentences = Sentence.limit(1000)
  end

  def error
    render text: '500エラーが発生しました', status: 500 and return
  end
end
