"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var command_line_args_1 = __importDefault(require("command-line-args"));
var command_line_usage_1 = __importDefault(require("command-line-usage"));
var consola_1 = __importDefault(require("consola"));
var index_1 = __importDefault(require("./index"));
function start() {
    var sections = [{
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
    ];
    var usage = (0, command_line_usage_1.default)(sections);
    var optionDefinitions = [{
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
    var options = (0, command_line_args_1.default)(optionDefinitions);
    if ('help' in options)
        console.log(usage);
    else if (!options.routes)
        consola_1.default.error("Unable to start Eski because no route configuration file was provided! \n \
        See eski --help for more information.");
    else {
        var server = new index_1.default({
            port: options.port,
            routes_configuration: { path: options.routes },
            custom_primitives: options.primitives
        });
        server.start();
    }
}
exports.start = start;
