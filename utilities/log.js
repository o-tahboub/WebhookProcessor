var path = require('path');

const { createStream } = require('rotating-file-stream');

let logFileName = new Intl.DateTimeFormat("en-US").format(Date.now()).toString() + '.txt';
let accessLogStream = createStream(logFileName, {
  interval: '1d', 
  path: path.join(__dirname, 'logs')
})

module.exports = accessLogStream;