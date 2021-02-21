const CLI = require('clui');
const Configstore = require('configstore');
const Octokit = require('@octokit/rest');
const Spinner = CLI.Spinner;
const { createBasicAuth } = require("@octokit/auth-basic");

const inquirer = require('./inquirer');
const pkg = require('../package.json');

const conf = new Configstore(pkg.name);

let octokit;

module.exports = {
    getInstance: () => {
        return octokit;
    },

    getStoredGitHubToken: () => {
        return conf.get('github.token');
    },

    getPersonalAccessToken: async () => {
        const credentials = await inquirer.askGitHubCredentials();
        const status = new Spinner('Authenticating you, please wait...');

        status.start();

        const auth = createBasicAuth({
            username: credentials.username,
            password: credentials.password,
            async on2Fa(){
                //tbd
            },
            token: {
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'git-init, the cli tool to initialize Git repos'
            }
        });

        try {
            const res = await auth();

            if(res.token){
                conf.set('github.token', res.token);
                return res.token;
            } else {
                throw new Error("GitHub token was not found in the response");
            }
        } finally {
            status.stop();
        }
    }
};