#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const consola = require('consola');
const {
    Server,
} = require('../index.js');

const server = new Server();

const sections = [{
        header: 'Eski',
        content: 'Mocking Simplified!'
    },
    {
        header: 'Options',
        optionList: [{
                name: 'routes,-r',
                description: 'Path to the route configuration file. Contains a map of API routes to schema configuration paths.'
            },
            {
                name: 'primitives,-p',
                description: 'Path to the custom primitives file.'
            },
            {
                name: 'port',
                description: 'Port on which the Eski server must be started. Defaults to 3000.'
            }
        ]
    }
]

const usage = commandLineUsage(sections)

const optionDefinitions = [{
        name: 'routes',
        type: String,
        multiple: false,
        alias: 'r'
    },
    {
        name: 'primitives',
        type: String,
        multiple: true,
        alias: 'p'
    },
    {
        name: 'port',
        type: String,
        multiple: false,
        defaultOption: 3000
    },
    {
        name: 'help'
    }
];
const options = commandLineArgs(optionDefinitions)

if ('help' in options) {
    console.log(usage)
} 
else if (!options.routes){
    consola.error("Unable to start Eski because no route configuration file was provided! \nSee eski --help for more information.")
}
else {
        server.start({
            port: options.port,
            routes_configuration: options.routes,
            custom_primitives: options.primitives
        });    
}
