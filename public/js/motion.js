define([
  'jquery',
  'buffer',
  'motion/detectSupport',
  'motion/videoTag',
  'motion/canvasTag',
  'motion/actionDetect',
  'motion/moveBall'
],function($,Buffer,DetectSupport,VideoTag,CanvasTag,ActionDetect,MoveBall){
  var Motion = function(){
    var w = 640,
        h = 480;
  
    var srcVideo,
        webcam,
        canvas,
        target;
    var getUserMedia = DetectSupport.getUserMedia,
        streamHandler = DetectSupport.streamHandler,
        audioContext = DetectSupport.audioContext;
   
    var newPosition = {x:0,y:0};

    var lastImageData;

    this.init = function(){
      var self = this;

      if(!getUserMedia){
        return alert('not support');
      }
      srcVideo = new VideoTag;
      srcVideo.init();
      srcVideo.hide();

      webcam = new VideoTag;
      webcam.init({id:'webcam',width:w,height:h});
      webcam.hide();

      canvas = new CanvasTag;
      canvas.init({width:w,height:h});
      
      canvasRock = new CanvasTag;
      canvasRock.init({width:w,height:h});

    };
    this.createBall = function(type){
      target = new MoveBall;
      target.init({type:'ball',width:20,height:20,targ:$('body')});
    };
    this.start = function(){
    
      getUserMedia({audio:true,video:true},function(stream){
        webcam.setSrc(streamHandler(stream)); 
        update();
      },mediaPlayError);
      


    };
    function shortTermBlend(){
      
      var sourceData = canvas.getContext().getImageData(0,0,w,h);
      if(!lastImageData) lastImageData = sourceData;

      var blendedData = canvasRock.getContext().createImageData(w,h);
      
      // return {x,y} or null
      newPosition = ActionDetect(blendedData.data , sourceData.data , lastImageData.data, w, h);
      
      canvasRock.getContext().putImageData(blendedData,0,0);

      lastImageData = sourceData;

    }
    function areaCheck(){

      var blendedData = canvasRock.getContext().getImageData(target.getX(),target.getY(),target.getW(),target.getH());
      
      var i = 0,
          avg = 0;
      while(i<(blendedData.data.length / 4)){
        avg += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
        ++i;
      }

      avg = Math.round(avg / (blendedData.data.length * 0.25));
      if (avg > 8) {
        target.setX(newPosition.x);
        target.setY(newPosition.y);
      }
    }
    function update(){
      canvas.draw({targ:webcam.getDom(),w:640,h:480});
      shortTermBlend();
      areaCheck();
      setTimeout(update,10);
    }
    function mediaPlayError(err){
      console.log(err);
    }
  };
  return Motion;
});
