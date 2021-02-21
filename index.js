const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');

clear();

console.log(
    chalk.yellow(
        figlet.textSync('git-init', {horizontalLayout:'full'})
    )
);

if (files.directoryExists('.git')) {
    console.log(chalk.red('Already a Git respository!'));
    process.exit();
}
