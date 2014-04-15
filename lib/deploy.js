var exec = require('child_process').exec;
var chalk = require('chalk');

process.chdir(__dirname + '/../');
var child = exec('./node_modules/metalsmith/bin/metalsmith',
  function (error, stdout, stderr) {
    if (stderr) {
      console.log(chalk.red(stderr));
      return;
    }
    if (stdout) {
      console.log(chalk.green(stdout));
      console.log(chalk.green('Deploying...'));
      exec('cd ./build && git init . && git add . && git commit -m "Deploy" && git push "git@github.com:populr/developers.populr.me.git" master:gh-pages --force && rm -rf .git',
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
      });
    }
    if (error !== null) {
      console.log(chalk.red('exec error: ' + error));
    }
});