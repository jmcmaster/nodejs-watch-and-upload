require('dotenv').config();
const queue = require("async/queue");
const chokidar = require('chokidar');
const fs = require('fs');
const uploader = require('./uploader');

let watcher;
const imageDirectory = `${process.env.LOCAL_IMAGE_DIRECTORY || 'images'}/`
const numberOfWorkers = 2;

const deleteFile = path => {
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }      
    });
}

const uploadFile = async (task, callback) => {
    await uploader.uploadFile(task.path);
    callback();
}

const onWatcherAdd = fullPath => {
    list.push({path: fullPath}, function(err) {
        deleteFile(fullPath);
    });
}

const list = queue(uploadFile, numberOfWorkers);

list.drain = function() {
    console.log('Done!\nAll items have been processed');
};

const start = () => {
    const watcherOptions = {
        cwd: '.',
        ignored: /(^|[\/\\])\../,
        persistent: true
    };

    watcher = chokidar.watch(imageDirectory, watcherOptions);

    watcher
        .on('ready', () => {            
            console.log('Watching...')
        })
        .on('add', onWatcherAdd)        
}

start();