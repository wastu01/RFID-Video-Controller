(async function () {

  var youtube;
  var rfid;

  var check;
  
  
  boardReady({board: 'Smart', device: '10dMjWX4', transport: 'mqtt'}, async function (board) {
    board.samplingInterval = 50;
    var youtubePlay, youtubeStop, youtubePause;
    await new Promise(function (resolve) {
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var scptTag = document.getElementsByTagName('script')[0];
      scptTag.parentNode.insertBefore(tag, scptTag);
      window.onYouTubeIframeAPIReady = function () {
        youtube = new YT.Player('player', {
          events: {
            onReady: function (evt) {
              youtube.loadVideoById({
                videoId: 'VSUGN5chbaA'
              });
              resolve();
            },
            onStateChange: onPlayerStateChange
          }
        });
      //   YT.Player('player', {
      //     events: {
      //       onReady: function (evt) {
      //         youtube.loadVideoById({
      //           videoId: 'VSUGN5chbaA'
      //         });
      //         resolve();
      //       },
      //       onStateChange: onPlayerStateChange
      //     }
      //  });
      };
    });
    function onPlayerStateChange(event) {
      if(event.data == youtubeStop) {
        youtubeStopCallback();
      }else if (event.data == youtubePlay) {
        youtubePlayCallback();
      }else if (event.data == youtubePause) {
        youtubePauseCallback();
      }
    };
    var varA = 10;
    if (varA >= 100) {
      varA = 100;
    }
    youtube.setVolume(varA);
    youtube.seekTo(0);
    youtube.stopVideo();
    rfid = getRFID(board);
    rfid.read();
    rfid.on("enter",async function(_uid){
      rfid._uid = _uid;
      console.log(rfid._uid);
      if (youtube.getPlayerState() == 1) {
        youtube.pauseVideo();
      } else if (youtube.getPlayerState() == 5) {
        speak('播放影片',["zh-TW",1,1,0.7], async function () {
  
        },0);
        youtube.playVideo();
      } else if (youtube.getPlayerState() == 2) {
        youtube.playVideo();
      }
    });
    rfid.on("leave",async function(_uid){
      check = 'quit';
      console.log(check);
    });
    board.on('error', async function (err) {
      board.error = err;
      check = 'errorrr';
      console.log(check);
    });
  });
  
  }());



  // function onYouTubeIframeAPIReady() {
  //   player1 = new YT.Player('player1', {
  //     events: {
  //       'onReady': onPlayerReady2
  //     }
  //   });
  // }