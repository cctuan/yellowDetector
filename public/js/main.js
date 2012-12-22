require([
  'jquery',
  'motion'
],function($,Motion){
  var motion = new Motion;
  motion.init();
  motion.createBall();
  motion.start();
});
