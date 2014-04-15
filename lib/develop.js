var staticserver = require('node-static');
var fs = require('fs');
var exec = require('child_process').exec;
var chalk = require('chalk');

process.chdir(__dirname + '/../');
var update = function (event, filename, cb) {
  var child = exec('./node_modules/metalsmith/bin/metalsmith',
    function (error, stdout, stderr) {
      if (stdout) {
        console.log(chalk.green(stdout));
      }
      if (stderr) {
        console.log(chalk.red(stderr));
      }
      if (error !== null) {
        console.log(chalk.red('exec error: ' + error));
      }
      if (cb) {
        cb();  
      }
  });
}

update(null, null, function(){
  fs.watch('./src', update);
  fs.watch('./templates', update);

  var server = new staticserver.Server('./build', {headers: {"Cache-Control": "no-cache, must-revalidate"}});
  require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      server.serve(request, response);
    }).resume();
  }).listen(8080);
  console.log('Listening on 0.0.0.0:' + chalk.green('8080'));
});