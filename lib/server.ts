import path from 'path';
import consola from 'consola';
import jsonServer from 'json-server';
import { Application } from 'express';
import SchemaProcessor from './schema';

import {
    RouteConfigurationsNotProvided,
    RouteConfigurationPathInvalid,
    CustomPrimitivesPathInvalid,
    UnableToLoadSchema,
    ServerNotUp
} from './error';

class Server {
    private server: Application;
    private processor: SchemaProcessor;
    private routes: Record<string, Record<string, string>> = {};

    private middlewares = jsonServer.defaults();

    constructor() {
        this.server = jsonServer.create();
        this.server.use(this.middlewares);
        this.processor = new SchemaProcessor();
    }

    private isServerUp = () => !!this.server;

    private hasRoutes = () => !!Object.keys(this.routes).length;

    private loadRoutes({
        routes_configuration
    }: { routes_configuration: string }) {
        try {
            this.routes = require(path.resolve(process.cwd(), routes_configuration));
        } catch (e) {
            consola.error(e);
            throw new RouteConfigurationPathInvalid(routes_configuration)
        }
        if (!this.hasRoutes()) throw new RouteConfigurationsNotProvided();

        Object.keys(this.routes).forEach((base_route: string) => {
            Object.keys(this.routes[base_route]).forEach((each_route: string) => {
                let schema_path = this.routes[base_route][each_route];
                const route = base_route + each_route;
                consola.info(`Successfully imported schema from ${schema_path}`);
                try {
                    this.processor.setSchema(require(schema_path));
                } catch (e) {
                    consola.error(e);
                    throw new UnableToLoadSchema(schema_path)
                }
                this.add({
                    route: route,
                    schema_processor: this.processor
                });
                consola.success(`Successfully hosted route '${route}' from ${path.relative(process.cwd(), routes_configuration)}.`);
            });
        });
    }

    private loadProcessor({
        processor,
        custom_primitives
    }: { processor: SchemaProcessor, custom_primitives: string[] }) {
        let primitives_module: Record<string, Function> = {};
        if (custom_primitives) {
            custom_primitives.forEach((module: string) => {
                try {
                    primitives_module = require(path.resolve(process.cwd(), module));
                } catch (e) {
                    consola.error(e);
                    if ((e as Error).message.includes('MODULE_NOT_FOUND')) throw new CustomPrimitivesPathInvalid(module)
                }
                Object.keys(primitives_module).forEach(function (eachPrimitive) {
                    processor.register(eachPrimitive, primitives_module[eachPrimitive]);
                    consola.success(`Successfully registered primitive '${eachPrimitive}' from ${path.relative(process.cwd(), module)}.`);
                });
            });
        }
    }

    start({
        port,
        routes_configuration,
        custom_primitives,
        callback
    }: {
        port: number,
        routes_configuration: string,
        custom_primitives: string[],
        callback?: () => void
    }) {
        if (!routes_configuration) throw new RouteConfigurationsNotProvided();
        else if (!this.isServerUp()) throw new ServerNotUp();

        consola.info(custom_primitives ? `Adding primitives from ${custom_primitives}.` : `No custom primitives registered.`);
        this.loadProcessor({
            processor: this.processor,
            custom_primitives: custom_primitives
        })

        consola.info(`Adding route configurations from ${routes_configuration}.`);
        this.loadRoutes({
            routes_configuration: routes_configuration
        });
        this.server!.listen(port, () => {
            consola.success(`Eski is running on port ${port}`);
            if (callback) {
                consola.info('Executing callback...')
                callback();
            }
        });
    }

    add({
        route,
        schema_processor
    }: { route: string, schema_processor: SchemaProcessor }) {
        if (this.isServerUp()) this.server!.get(route, (req, res) => res.jsonp(schema_processor.process()));
    }
}

export default Server;