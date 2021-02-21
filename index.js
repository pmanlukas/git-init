const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const inquirer = require('./lib/inquirer');
const Configstore = require('configstore');

const conf = new Configstore('Git-Init');

clear();

console.log(
    chalk.yellow(
        figlet.textSync('Git-Init', {horizontalLayout:'full'})
    )
);

const run = async () => {
    const credentials = await inquirer.askGitHubCredentials();
    console.log(credentials);
};

run();

if (files.directoryExists('.git')) {
    console.log(chalk.red('Already a Git respository!'));
    process.exit();
}
