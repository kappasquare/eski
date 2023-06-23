import path from 'path';
import consola from 'consola';
import jsonServer from 'json-server';
import type { Application } from 'express';
import SchemaProcessor from './schema';

import {
    RouteConfigurationsNotProvided,
    RouteConfigurationPathInvalid,
    CustomPrimitivesPathInvalid,
    UnableToLoadSchema,
    ServerNotUp
} from './error';

import EventEmitter from 'events';
import type http from 'http';

type Only<T, U> = {
    [P in keyof T]: T[P];
} & {
        [P in keyof U]?: never;
    };

type Either<T, U> = Only<T, U> | Only<U, T>;
type Modes = 'cli' | 'lib';
type RoutesConfiguration = Either<{ path: string }, { json: string }>;
class EskiServer {
    private server: Application;
    private httpServer?: http.Server;
    private processor: SchemaProcessor;
    private routes: Record<string, Record<string, string>> = {};

    private middlewares = jsonServer.defaults();
    private emitter = new EventEmitter();
    private mode: Modes;

    private port: number;
    private routes_configuration: RoutesConfiguration;
    private custom_primitives?: string[];

    constructor(options: {
        port: number,
        routes_configuration: RoutesConfiguration,
        custom_primitives?: string[],
        mode?: 'cli' | 'lib'
    }) {
        this.server = jsonServer.create();
        this.server.use(this.middlewares);
        this.processor = new SchemaProcessor();
        this.mode = options.mode ?? 'cli';
        this.port = options.port ?? 3000;
        this.routes_configuration = options.routes_configuration;
        this.custom_primitives = options.custom_primitives;
    }

    on(event: string, listener: (...args: any[]) => void) {
        if (this.mode == 'cli') consola.warn(`Eski is running on CLI mode . Switch to lib mode to subscribe to events!`)
        return this.emitter.on(event, listener);
    }

    private isServerUp = () => !!this.server;

    private hasRoutes = () => !!Object.keys(this.routes).length;

    private speak = (log_details: { message: string, level: 'info' | 'success' | 'error' } | null,
        event_details: { name: string, data: any }) => {
        if (this.mode == 'cli' && log_details) {
            consola[log_details.level](log_details.message);
        } else {
            this.emitter.emit(event_details.name, event_details.data);
        }
    }

    private getRoutesConfiguration = (routes_configuration: RoutesConfiguration) => routes_configuration.path ?
        routes_configuration.path : routes_configuration.json!;

    private parseRoutesConfiguration(routes_configuration: RoutesConfiguration) {
        try {
            const routes = routes_configuration.path ? require(path.resolve(process.cwd(), routes_configuration.path))
                : JSON.parse(routes_configuration.json!);
            this.speak(null, { name: 'route-loaded', data: { routes_configuration } })
            return routes;
        } catch (e) {
            consola.error(e);
            const error = new RouteConfigurationPathInvalid(this.getRoutesConfiguration(routes_configuration))
            this.speak(null, { name: 'error', data: { error } })
            throw error;
        }
    }

    private loadRoutes({
        routes_configuration
    }: { routes_configuration: RoutesConfiguration }) {
        // Parsing Routes
        this.routes = this.parseRoutesConfiguration(routes_configuration);

        if (!this.hasRoutes()) {
            const error = new RouteConfigurationsNotProvided();
            this.speak(null, { name: 'error', data: { error } })
            throw error;
        }

        Object.keys(this.routes).forEach((base_route: string) => {
            Object.keys(this.routes[base_route]).forEach((each_route: string) => {
                let schema_path = this.routes[base_route][each_route];
                const route = base_route + each_route;
                try {
                    this.processor.setSchema(require(schema_path));
                    this.speak(
                        {
                            level: 'success',
                            message: `Successfully imported schema from ${schema_path}`
                        },
                        {
                            name: 'schema-loaded',
                            data: { schema_path }
                        })
                } catch (e) {
                    consola.error(e);
                    const error = new UnableToLoadSchema(schema_path);
                    this.speak(null, { name: 'error', data: { error } })
                    throw error;
                }
                this.add({
                    route: route,
                    schema_processor: this.processor
                });
                this.speak(
                    {
                        level: 'success',
                        message: `Successfully hosted route '${route}'.`
                    },
                    {
                        name: 'route-hosted',
                        data: { route }
                    })
            });
        });
    }

    private loadProcessor({
        processor,
        custom_primitives
    }: { processor: SchemaProcessor, custom_primitives?: string[] }) {
        let primitives_module: Record<string, Function> = {};
        if (custom_primitives) {
            custom_primitives.forEach((module: string) => {
                try {
                    primitives_module = require(path.resolve(process.cwd(), module));
                    this.speak(null, { name: 'primitive-loaded', data: { module } })
                } catch (e) {
                    consola.error(e);
                    if ((e as Error).message.includes('MODULE_NOT_FOUND')) {
                        const error = new CustomPrimitivesPathInvalid(module);
                        this.speak(null, { name: 'error', data: { error } })
                        throw error;
                    }
                }
                Object.keys(primitives_module).forEach((eachPrimitive) => {
                    processor.register(eachPrimitive, primitives_module[eachPrimitive]);
                    this.speak(
                        {
                            level: 'success',
                            message: `Successfully registered primitive '${eachPrimitive}' from ${path.relative(process.cwd(), module)}.`
                        },
                        {
                            name: 'primitive-registered',
                            data: { eachPrimitive }
                        });
                });
            });
        }
    }

    start(callback?: () => void) {
        if (!this.routes_configuration) {
            const error = new RouteConfigurationsNotProvided();
            this.speak(null, { name: 'error', data: { error } })
            throw error;
        } else if (!this.isServerUp()) {
            const error = new ServerNotUp();
            this.speak(null, { name: 'error', data: { error } })
            throw error;
        }

        // Loading Processor with Custom Primitives
        var message = this.custom_primitives ? `Adding primitives from ${this.custom_primitives}.` : `No custom primitives registered.`;
        this.speak({
            level: 'info',
            message
        }, {
            name: 'info',
            data: { message }
        })
        this.loadProcessor({
            processor: this.processor,
            custom_primitives: this.custom_primitives
        })

        this.loadRoutes({ routes_configuration: this.routes_configuration });

        // Starting Eski Server
        message = `Starting Eski Server.`;
        this.speak({
            level: 'info',
            message
        }, {
            name: 'info',
            data: { message }
        })
        this.httpServer = this.server.listen(this.port, () => {
            this.speak({
                level: 'success',
                message: `Eski is running on port ${this.port}`
            }, {
                name: 'started',
                data: { port: this.port }
            })
            if (callback) {
                consola.info('Executing callback...')
                callback();
            }
        });
    }

    private add({
        route,
        schema_processor
    }: { route: string, schema_processor: SchemaProcessor }) {
        if (this.isServerUp()) this.server!.get(route, (req, res) => {
            const response = schema_processor.process();
            const code = 200;
            res.status(code).jsonp(response)
            this.emitter.emit('response', { route, response, code });
        });
    }

    stop() {
        if (this.httpServer) {
            this.httpServer.close();
            const message = `Server on port ${this.port} was stopped!`;
            this.speak({
                level: 'info',
                message
            }, {
                name: 'info',
                data: { message }
            })
        }
    }
}

export default EskiServer;