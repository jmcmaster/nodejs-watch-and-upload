require('dotenv').config();
const queue = require("async/queue");
const chokidar = require('chokidar');
const fs = require('fs');
const uploader = require('./uploader');

const deleteFile = path => {
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log('Deleted ' + path);
    });
}

const queueWorker = async (task) => {
    await uploader.uploadFile(task.path);
}

const imageDirectory = process.env.LOCAL_IMAGE_DIRECTORY || 'images';

const onWatcherAdd = path => {
    list.push({path}, (err) => {
        if (err) {
            console.error(err);
            return;
        }

        const fullPath = __dirname + `/${imageDirectory}/` + path;
        deleteFile(fullPath);
    });
}

const numberOfWorkers = 2;
const list = queue(queueWorker, numberOfWorkers);

list.drain = function() {
    console.log('All queue items have been processed!');
};

let watcher;

const start = () => {
    const watcherOptions = {
        cwd: `./${imageDirectory}/`,
        ignored: /(^|[\/\\])\../,
        persistent: true
    };

    watcher = chokidar.watch('.', watcherOptions);

    watcher
        .on('ready', () => {
            console.log('Watching...');
        })
        .on('add', onWatcherAdd)
}

start();