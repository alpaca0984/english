$(function() {
  var Util = function() {};
  Util.prototype.format = function(s) {
    return s.replace(/\n/g, '<br>');
  };
  Util.prototype.capitalize = function(s) {
    return s.replace(/\S/, function(m) {
      return m.toUpperCase();
    });
  };

  var Recognizer = function(args) {
    this.final_transcript = '';
    this.util = new Util();

    this.speech = new webkitSpeechRecognition();
    this.speech.continuous = true;
    this.speech.maxAlternatives = 5;
    this.speech.interimResults = true;
    this.speech.lang = 'en-us';
    this.speech.onend = function() {};
    this.speech.onerror = function(e) {
      var msg = e.error + " error";
      if (e.error === 'no-speech') {
        msg = "No speech was detected. Please try again.";
      } else if (e.error === 'audio-capture') {
        msg = "Please ensure that a microphone is connected to your computer.";
      } else if (e.error === 'not-allowed') {
        msg = "The app cannot access your microphone. Please go to chrome://settings/contentExceptions#media-stream and allow Microphone access to this website.";
      }
      $("#warning").html("<p>" + msg + "</p>");
      setTimeout(function() {
        $("#warning").html("");
      }, 5000);
    };
    this.speech.onresult = function(e) {
      if (typeof(e.results) == 'undefined') {
        return;
      }
      var interim_transcript = '';
      for (var i = e.resultIndex; i < e.results.length; ++i) {
        var val = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          this.final_transcript += " " + val;
        } else {
          interim_transcript += " " + val;
        }
      }
      console.log(interim_transcript);
      $("#labnol").html(this.util.format(this.util.capitalize(this.final_transcript)));
      $("#notfinal").html(this.util.format(interim_transcript));
    }.bind(this);
    this.speech.onaudioend = function() {
      console.log("audioend");
    };
    this.speech.onsoundend = function() {
      console.log("soundend");
    };
    this.speech.onspeechend = function() {
      console.log("speechend");
    };
    this.speech.onend = function() {
      console.log("end");
    };
  };

  var Question = function() {
    this.list = [
      {q_id: 1, q_body: "This is a pen"},
      {q_id: 2, q_body: "He is a teacher"},
      {q_id: 3, q_body: "I like Alpaca"}
    ];
    this.idx = 0;
  };
  Question.prototype.current = function() {
    return this.list[this.idx];
  };
  Question.prototype.next = function() {
    return this.list[++this.idx];
  };
  Question.prototype.hasNext = function() {
    return this.list[this.idx + 1] != null;
  };

  // Timer object
  var Timer = function(args) {
    this.recognizer = new Recognizer();
    this.question = new Question();

    this.length = args.length;
    this.rest = args.length;
    this.interval = args.interval;

    this.doms = {
      $labnol: $("#labnol"),
      $correct: $("#correct_answer")
    };
  };
  Timer.prototype.start = function() {
    this.doms.$correct.text(this.question.current().q_body);
    this.recognizer.speech.start();
    this.repeat = setInterval(this.closure.bind(this), this.interval);
  };
  Timer.prototype.stop = function() {
    this.recognizer.speech.stop();
    clearInterval(this.repeat);
  };
  Timer.prototype.pause = function() {
    clearInterval(this.repeat);
  };
  Timer.prototype.resume = function() {
    this.repeat = setInterval(this.closure.bind(this), this.interval);
  };
  Timer.prototype.inflect = function(s) {
    return s.replace(/\s+/g, '').toLowerCase();
  };
  Timer.prototype.refresh = function() {
    this.doms.$correct.text(this.question.next().q_body);
    this.doms.$labnol.text('');
    this.recognizer.final_transcript = '';
    this.rest = this.length;
  };
  Timer.prototype.judge = function() {
    return this.inflect(this.doms.$labnol.text()) == this.inflect(this.doms.$correct.text());
  };
  Timer.prototype.closure = function() {
    console.log(this.rest);
    if (--this.rest <= 0) {
      var message = (this.judge()) ? "正解!" : "不正解...";
      alert(message);
      this.question.hasNext() ? this.refresh() : this.stop();
    }
  };

  var timer = new Timer({length: 8, interval: 1000});

  //------------------- 
  // event listener
  //------------------- 
  $("#start").on("click", function() {
    timer.start();
  });

  $("#pause").on("click", function() {
    timer.pause();
  });

  $("#resume").on("click", function() {
    timer.resume();
  });
});
