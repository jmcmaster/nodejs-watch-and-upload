require('dotenv').config();
var queue = require("async/queue");
const chokidar = require('chokidar');
const fs = require('fs');

let watcher;
const imageDirectory = `${process.env.IMAGE_DIRECTORY}/`
const numberOfWorkers = 2;

const deleteFile = path => {
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }      
    });
}

const list = queue(function(task, callback) {  
    console.log('Uploading file...');          
    setTimeout(() => {
        callback();            
    }, 5000);
}, numberOfWorkers);

list.drain = function() {
    console.log('Done!\nAll items have been processed');
};

const watcherOptions = { 
    cwd: '.',
    ignored: /(^|[\/\\])\../,       
    persistent: true
};

const onWatcherAdd = path => {
    list.push({path}, function(err) {                
        console.log('Uploaded ' + path);
        deleteFile(path);
    });
}

const start = () => {
    watcher = chokidar.watch(imageDirectory, watcherOptions);

    watcher
        .on('ready', () => {            
            console.log('Watching...')
        })
        .on('add', onWatcherAdd)        
}

start();