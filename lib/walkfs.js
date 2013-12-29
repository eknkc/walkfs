var fs = require("fs")
  , path = require("path")
  , EventEmitter = require('events').EventEmitter

module.exports = function(dir, iterator, cb) {
  var stack = [dir];
  var emitter = new EventEmitter();

  function done(err) {
    if (cb) cb(err);

    if (err)
      emitter.emit('error', err);
    else
      emitter.emit('end');
  }

  function walk() {
    var cur = stack.pop();

    if (!cur)
      return done();

    fs.lstat(cur, function (err, stat) {
      if (err) return done(err);

      function iterate(type) {
        var data = {
          path: cur,
          stat: stat,
          type: type
        };

        emitter.emit(type, data);
        emitter.emit('path', data);

        if (iterator)
          iterator(data, walk);
        else
          setImmediate(walk);
      }

      if (stat.isDirectory()) {
        fs.readdir(cur, function (err, files) {
          if (err) return done(err);

          files.forEach(function (file) {
            stack.push(path.resolve(cur, file));
          });

          iterate('directory');
        });
      } else if (stat.isSymbolicLink()) {
        iterate('link');
      } else {
        iterate('file');
      }
    });
  }

  walk();

  return emitter;
}
