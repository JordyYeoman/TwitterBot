/*
 * Create and export configuration variables used by the API
 *
 */
require("dotenv").config();
const secrets = require('./secrets');

// Container for all environments
const environments = {};

environments.production = {
    httpPort: process.env.HTTP_PORT,
    httpAddress: process.env.HOST,
    envName: 'production',

    // database: {
    //     url: secrets.read('STORAGE_HOST') || process.env.STORAGE_HOST,
    //     name: 'workflow-db',
    //     connectRetry: 5, // seconds
    // },
    workflow: {
        pollingInterval: 10, // Seconds
    },
    loginprovider: {
        domain: secrets.read('LOGINUSERNAME') || process.env.LOGINUSERNAME,
        secret: secrets.read('PASSWORD') || process.env.PASSWORD
    }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment defined above,
// if not default to production
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.production;

// export the module
module.exports = environmentToExport;