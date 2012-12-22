// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  baseUrl: 'js',
  deps:["main"],
  paths: {
    // Major libraries
    jquery: 'libs/jquery',
    buffer: 'libs/buffer-loader',
  },
  shim: {
    buffer: ['jquery'] 
  }

});

// Let's kick off the application

