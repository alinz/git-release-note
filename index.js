#!/usr/bin/env node
'use strict';

var Rx = require('rx');
var spawn = require('child_process').spawn;

function splitBuffer(buffer, split, cb) {
  buffer.toString('utf8').split(split).forEach(function (item) {
    cb(item);
  });
}

function rxSpwan(command, args, options) {
  options = options || { cwd: '.' };

  return Rx.Observable.create(function (observer) {
    var spawnChild = spawn(command, args, options);

    spawnChild.stdout.on('data', function (data) {
      splitBuffer(data, '\n', function (chunk) {
        observer.onNext({ type: 'data', data: chunk });
      });
    });

    spawnChild.stderr.on('data', function (data) {
      splitBuffer(data, '\n', function (chunk) {
        observer.onNext({ type: 'error', data: chunk });
      });
    });

    spawnChild.on("close", function (errorCode) {
      observer.onCompleted();
    });
  });
}

function genReleateNote() {
  var source = rxSpwan('git', ['log', '--pretty=oneline']);

  source.filter(function (item) {
    return item.type === 'data' && item.data && item.data !== '';
  }).map(function (line) {
    return line.data.match(/([0-9abcdef]{40}) (.+)/);
  }).filter(function (group) {
    return group.length == 3;
  }).map(function (group) {
    return {
      hash: group[1],
      message: group[2]
    };
  }).map(function (commit) {
    commit.info = commit.message.match(/Merge branch '(.+)\/(.+)'/);
    return commit;
  }).filter(function (commit) {
    return commit.info && commit.info.length === 3;
  }).map(function (commit) {
    commit.info = {
      issue: commit.info[1],
      number: commit.info[2]
    };
    return commit;
  }).forEach(function (commit) {
    var info = commit.info;
    if (info.issue === 'release') {
      console.log('');
      console.log(info.number);
    } else {
      console.log('    Fixed issue ' + info.number);
    }
  });
}

genReleateNote();
