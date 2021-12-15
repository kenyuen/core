/*
    Example test group:
        {
            groupName: 'Example',
            timesToRun: 1,
            processes: ['exampleServer']
        }
*/

const basePolling = require('./ready-conditions/base-polling');

module.exports = {
    libPaths: [
        'packages/web/dist/web.umd.js',
        'packages/workspaces-api/dist/workspaces.umd.js'
    ],
    run: [
        {
            groupName: 'notifications'
        },
        {
            groupName: 'system'
        },
        {
            groupName: 'appManager'
        },
        {
            groupName: 'channels'
        },
        {
            groupName: 'contexts'
        },
        {
            groupName: 'intents'
        },
        {
            groupName: 'interop'
        },
        {
            groupName: 'windows'
        },
        {
            groupName: 'workspaces'
        }
    ],
    runPuppet: [
        {
            groupName: 'init',
            processes: ['puppetBridge']
        }
    ],
    processes: [
        {
            name: 'remoteSource',
            path: './remote-source/index.js',
            readyCondition: basePolling({
                hostname: 'localhost',
                port: 9998,
                path: '/v1/apps/search',
                method: 'GET',
                pollingInterval: 100,
                pollingTimeout: 30 * 1000
            })
        },
        {
            name: 'puppetBridge',
            path: './puppet-env/puppet-bridge.js',
            readyCondition: basePolling({
                hostname: 'localhost',
                port: 9997,
                path: '/',
                method: 'GET',
                pollingInterval: 100,
                pollingTimeout: 30 * 1000
            })
        }
    ]
};
