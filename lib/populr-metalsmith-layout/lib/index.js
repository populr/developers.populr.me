var basename = require('path').basename;
var metalsmith = require('metalsmith');
var dirname = require('path').dirname;
var extname = require('path').extname;
var handlebars = require('handlebars');
var each = require('async').each;
var fs = require('fs');

handlebars.registerHelper('is', function (value, test, options) {
  if (value === test) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

module.exports = plugin;

function plugin(options){
  options = options || {};
  var keys = options.keys || [];
  var dir = options.directory || 'templates';

  return function(files, metalsmith, done){
    fs.readdir(dir, function(err, files){
      if (err) {
        fatal('Partials directory does not exist!');
        done();
      }
      else {
        each(files, loadPartial, done);
      }
    });

    function loadPartial(file, done) {
      if (file.indexOf('_') !== 0) {
        done();
        return;
      }
      var partialFile = metalsmith.join(dir, file);
      fs.readFile(partialFile, function (err, data) {
        if (err) throw err;
        handlebars.registerPartial(basename(file, extname(file)), data.toString());
        done();
      });
    }
  };
}