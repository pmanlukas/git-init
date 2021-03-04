const CLI = require('clui');
const Configstore = require('configstore');
const Octokit = require('@octokit/rest');
const Spinner = CLI.Spinner;
//TODO: change to new library since it is deprecated
const { createBasicAuth } = require("@octokit/auth-basic");
//TODO: use new library for authentication
const { createTokenAuth } = require("@octokit/auth-token");

const inquirer = require('./inquirer');
const pkg = require('../package.json');

const conf = new Configstore(pkg.name);

let octokit;

module.exports = {
    getInstance: () => {
        return octokit;
    },

    getStoredGithubToken: () => {
        return conf.get('github.token');
    },

    //TODO: adjust to new auth library
    githubAuth: (token) => {
        octokit = new Octokit({
            auth: token
        });
    },

    //TODO: remove since PAT auth doesn't need this logic
    getPersonalAccesToken: async () => {
        //TODO: adjust inquirer to ask for PAT
        const credentials = await inquirer.askGithubPAT();
        const status = new Spinner('Authenticating you, please wait...');

        status.start();

        //TODO: replace with new Auth code
        const auth = createBasicAuth({
            username: credentials.username,
            password: credentials.password,
            async on2Fa() {
                status.stop();
                const res = await inquirer.getTwoFactorAuthenticationCode();
                status.start();
                return res.twoFactorAuthenticationCode;
            },
            token: {
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'ginit, the command-line tool for initalizing Git repos'
            }
        });

        //TODO: refactor to save token after asking for it in inquirer
        try {
            const res = await auth();

            if (res.token) {
                conf.set('github.token', res.token);
                return res.token;
            } else {
                throw new Error("GitHub token was not found in the response");
            }
        } finally {
            status.stop();
        }
    },
};