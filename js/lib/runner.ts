import commandLineArgs, { OptionDefinition } from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import consola from 'consola';

import EskiServer from './index';

export function start() {

    const sections = [{
        header: 'Eski',
        content: 'Mock Servers, Simplified!'
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

    const optionDefinitions: OptionDefinition[] = [{
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
        type: Number,
        multiple: false,
        defaultValue: 3000
    },
    {
        name: 'help'
    }
    ];

    const options = commandLineArgs(optionDefinitions)

    if ('help' in options) console.log(usage)
    else if (!options.routes)
        consola.error("Unable to start Eski because no route configuration file was provided! \n \
        See eski --help for more information.")
    else {
        const server = new EskiServer({
            port: options.port,
            routes_configuration: { path: options.routes },
            custom_primitives: options.primitives
        });
        server.start();
    }

}