/*global __dirname:false*/

var childProcess = require('child_process');
var fs = require('fs');
var stalker = require('stalker');

var BASE_PATH = __dirname.substr(0, __dirname.lastIndexOf('/') + 1);
var ACTIONS_PATH = BASE_PATH + 'js/actions/';
var WORK_PATH = BASE_PATH + 'working/';
var WATCH_PATH = WORK_PATH + 'watch/';
var PROCESS_PATH = WORK_PATH + 'process/';
var IGNORE_PATH = WORK_PATH + 'ignore/';
var FINISHED_PATH = WORK_PATH + 'finished/';
var PS_FILE_EXTENSION = '.psd';
var PROCESS_SCRIPT_FILENAME = 'process.jsx';
var PROCESS_SCRIPT = BASE_PATH + 'js/' + PROCESS_SCRIPT_FILENAME;
var CONFIG_FILENAME = 'config.json';
var WATCH_OPTIONS = {
  buffer: 1000,
  recurse: true
};

var uniqueID = 0;
var processQueue = [];
var actionNames = [];
var isProcessing = false;




var deleteFolderRecursive = function (path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file) {
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};




var processFile = function () {
  if (processQueue.length) {
    isProcessing = true;
    var config = processQueue.shift();
    var jsxFile = PROCESS_PATH + config.taskID + '/' + PROCESS_SCRIPT_FILENAME;
    var configFile = PROCESS_PATH + config.taskID + '/' + CONFIG_FILENAME;

    console.log(config.filename + ' processing started (' + jsxFile + ')');

    childProcess.exec('open -b com.adobe.Photoshop --wait-apps --args ' + jsxFile, function () {
      console.log(config.filename + ' processing finished');
      fs.unlink(jsxFile);
      fs.unlink(configFile);
      fs.rename(PROCESS_PATH + config.taskID, FINISHED_PATH + new Date().getTime());

      processFile();
    });
  } else {
    isProcessing = false;
  }
};




var onFileAdded = function (err, files) {
  if (files.substr) {
    // 'files' is a String if WATCH_OPTIONS.buffer is not set, so convert to array in this case
    files = [files];
  }

  files.forEach(function (file) {
    actionNames.every(function (actionName) {
      if (file.indexOf(actionName) !== -1) {
        (function () {
          var taskID = 'task' + (uniqueID++);
          var config = {
            taskID: taskID,
            filename: file.substr(file.lastIndexOf('/') + 1),
            basePath: BASE_PATH,
            processPath: PROCESS_PATH + taskID + '/',
            actionPath: ACTIONS_PATH,
            actionName: actionName
          };
          if (config.filename.toLowerCase().indexOf(PS_FILE_EXTENSION.toLowerCase()) !== -1) {
            fs.existsSync(config.processPath) || fs.mkdirSync(config.processPath);
            fs.writeFileSync(config.processPath + CONFIG_FILENAME, JSON.stringify(config));
            fs.rename(file, config.processPath + config.filename);
            fs.createReadStream(PROCESS_SCRIPT).pipe(fs.createWriteStream(config.processPath + PROCESS_SCRIPT_FILENAME));
            console.log(config.filename + ' queued');
            processQueue.push(config);
          } else {
            console.log(config.filename + ' ignored');
            fs.rename(file, IGNORE_PATH + config.taskID + '/' + config.filename);
          }
        }());
        return false;
      }
      return true;
    });
  });

  if (processQueue.length && !isProcessing) {
    processFile();
  }
};




fs.existsSync(WORK_PATH) || fs.mkdirSync(WORK_PATH);
fs.existsSync(WATCH_PATH) || fs.mkdirSync(WATCH_PATH);
fs.existsSync(IGNORE_PATH) || fs.mkdirSync(IGNORE_PATH);
fs.existsSync(FINISHED_PATH) || fs.mkdirSync(FINISHED_PATH);
deleteFolderRecursive(PROCESS_PATH);
fs.mkdirSync(PROCESS_PATH);

fs.readdirSync(ACTIONS_PATH).forEach(function (file) {
  var actionName = file.split('.')[0];
  var actionFolder = WATCH_PATH + actionName;
  actionNames.push(actionName);
  fs.existsSync(actionFolder) || fs.mkdirSync(actionFolder);
});

console.log('watching ' + WATCH_PATH);
stalker.watch(WATCH_PATH, WATCH_OPTIONS, onFileAdded);
