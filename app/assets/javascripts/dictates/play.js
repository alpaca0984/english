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

    var speech = new webkitSpeechRecognition();
    speech.continuous = true;
    speech.maxAlternatives = 5;
    speech.interimResults = true;
    speech.lang = 'en-us';
    speech.onend = function() {};
    speech.onerror = function(e) {
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
    speech.onresult = function(e) {
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
    speech.onaudioend = function() {
      console.log("audioend");
    };
    speech.onsoundend = function() {
      console.log("soundend");
    };
    speech.onspeechend = function() {
      console.log("speechend");
    };
    speech.onend = function() {
      console.log("end");
    };
    this.speech = speech;
  };

  var Question = function() {
    this.list = gon.sentences;
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
      $japanese: $("#japanese"),
      $correct: $("#correct"),
      $countdown: $("#countdown p")
    };
  };
  Timer.prototype.start = function() {
    this.doms.$countdown.text(this.rest + ' sec');
    this.doms.$japanese.text(this.question.current().japanese);
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
    return s.replace(/[\s+\.]/g, '').toLowerCase();
  };
  Timer.prototype.refresh = function() {
    this.rest = this.length;
    this.doms.$countdown.text(this.rest + ' sec');
    this.doms.$japanese.text(this.question.next().japanese);
    this.doms.$labnol.text('');
    this.doms.$correct.text('');
    this.recognizer.final_transcript = '';
  };
  Timer.prototype.judge = function() {
    console.log(this.inflect(this.doms.$labnol.text()));
    console.log(this.inflect(this.question.current().english));
    return this.inflect(this.doms.$labnol.text()) == this.inflect(this.question.current().english);
  };
  Timer.prototype.closure = function() {
    this.doms.$countdown.text(--this.rest + ' sec');
    if (this.rest <= 0) {
      this.doms.$correct.text(this.question.current().english);
      var message = (this.judge()) ? "○ 正解!" : "× 不正解...";
      this.doms.$countdown.text(message);
      if (this.rest <= -2) {
        this.question.hasNext() ? this.refresh() : this.stop();
      }
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
