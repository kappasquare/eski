const path = require('path');
const consola = require('consola');
const jsonServer = require('json-server');
const SchemaProcessor = require('./schema.js');

const DEFAULT_PORT = 3000;

const {
    RouteConfigurationsNotProvided,
    RouteConfigurationPathInvalid,
    CustomPrimitivesPathInvalid,
    SchemaPathInvalid
} = require('./error.js');

module.exports = class Server {

    server = null;
    processor = null;
    routes = null;
    middlewares = jsonServer.defaults();

    constructor() {
        this.server = jsonServer.create();
        this.server.use(this.middlewares);
    }

    _load_routes({
        routes_configuration
    }) {
        try {
            this.routes = require(path.resolve(process.cwd(), routes_configuration));
        } catch (e) {
            consola.error(e);
            throw new RouteConfigurationPathInvalid(routes_configuration)
        }
        Object.keys(this.routes).forEach((parent) => {
            Object.keys(this.routes[parent]).forEach((route) => {
                let _path = this.routes[parent][route];
                const _route = parent + route;
                consola.info(`Successfully imported schema from ${_path}`);

                try {
                    this.processor.set_schema(require(_path));
                } catch (e) {
                    consola.error(e);
                    throw new SchemaPathInvalid(_path)
                }

                consola.success(`Successfully hosted route '${_route}' from ${path.relative(process.cwd(), routes_configuration)}.`);
                this.add({
                    route: _route,
                    response_schema_processor: this.processor
                });
            });
        });
    }

    _load_processor({
        processor,
        custom_primitives
    }) {
        let _module = null

        if (custom_primitives) {
            custom_primitives.forEach((each) => {
                try {
                    _module = require(path.resolve(process.cwd(), each));
                } catch (e) {
                    consola.error(e);
                    if (e.code == 'MODULE_NOT_FOUND') {
                        throw new CustomPrimitivesPathInvalid(each)
                    }
                }
                Object.keys(_module).forEach(function(eachPrimitive) {
                    processor.register(eachPrimitive, _module[eachPrimitive]);
                    consola.success(`Successfully registered primitive '${eachPrimitive}' from ${path.relative(process.cwd(), each)}.`);
                });
            });
        }
    }

    start({
        port = DEFAULT_PORT,
        routes_configuration,
        custom_primitives,
        callback
    }) {
        if (!routes_configuration) {
            throw new RouteConfigurationsNotProvided();
        }

        this.processor = new SchemaProcessor();
        consola.info(custom_primitives ? `Adding primitives from ${custom_primitives}.` : `No custom primitives registered.`);
        this._load_processor({
            processor: this.processor,
            custom_primitives: custom_primitives
        })

        consola.info(`Adding route configurations from ${routes_configuration}.`);
        this._load_routes({
            routes_configuration: routes_configuration
        });
        this.server.listen(port, () => {
            consola.success(`Eski is running on port ${port}`);
            if (callback) {
                consola.info('Executing callback...')
                callback();
            }
        });
    }

    add({
        route,
        response_schema_processor
    }) {
        this.server.get(route, (req, res) => {
            res.jsonp(response_schema_processor.process());
        });
    }
}
