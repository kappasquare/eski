"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var consola_1 = __importDefault(require("consola"));
var json_server_1 = __importDefault(require("json-server"));
var schema_1 = __importDefault(require("./schema"));
var error_1 = require("./error");
var events_1 = __importDefault(require("events"));
var EskiServer = /** @class */ (function () {
    function EskiServer(options) {
        var _this = this;
        var _a, _b;
        this.routes = {};
        this.middlewares = json_server_1.default.defaults();
        this.emitter = new events_1.default();
        this.isServerUp = function () { return !!_this.server; };
        this.hasRoutes = function () { return !!Object.keys(_this.routes).length; };
        this.speak = function (log_details, event_details) {
            if (_this.mode == 'cli' && log_details) {
                consola_1.default[log_details.level](log_details.message);
            }
            else {
                _this.emitter.emit(event_details.name, event_details.data);
            }
        };
        this.getRoutesConfiguration = function (routes_configuration) { return routes_configuration.path ?
            routes_configuration.path : routes_configuration.json; };
        this.server = json_server_1.default.create();
        this.server.use(this.middlewares);
        this.processor = new schema_1.default();
        this.mode = (_a = options.mode) !== null && _a !== void 0 ? _a : 'cli';
        this.port = (_b = options.port) !== null && _b !== void 0 ? _b : 3000;
        this.routes_configuration = options.routes_configuration;
        this.custom_primitives = options.custom_primitives;
    }
    EskiServer.prototype.on = function (event, listener) {
        if (this.mode == 'cli')
            consola_1.default.warn("Eski is running on CLI mode . Switch to lib mode to subscribe to events!");
        return this.emitter.on(event, listener);
    };
    EskiServer.prototype.parseRoutesConfiguration = function (routes_configuration) {
        try {
            var routes = routes_configuration.path ? require(path_1.default.resolve(process.cwd(), routes_configuration.path))
                : JSON.parse(routes_configuration.json);
            this.speak(null, { name: 'route-loaded', data: { routes_configuration: routes_configuration } });
            return routes;
        }
        catch (e) {
            consola_1.default.error(e);
            var error = new error_1.RouteConfigurationPathInvalid(this.getRoutesConfiguration(routes_configuration));
            this.speak(null, { name: 'error', data: { error: error } });
            throw error;
        }
    };
    EskiServer.prototype.loadRoutes = function (_a) {
        var _this = this;
        var routes_configuration = _a.routes_configuration;
        // Parsing Routes
        this.routes = this.parseRoutesConfiguration(routes_configuration);
        if (!this.hasRoutes()) {
            var error = new error_1.RouteConfigurationsNotProvided();
            this.speak(null, { name: 'error', data: { error: error } });
            throw error;
        }
        Object.keys(this.routes).forEach(function (base_route) {
            Object.keys(_this.routes[base_route]).forEach(function (each_route) {
                var schema_path = _this.routes[base_route][each_route];
                var route = base_route + each_route;
                try {
                    _this.processor.setSchema(require(schema_path));
                    _this.speak({
                        level: 'success',
                        message: "Successfully imported schema from ".concat(schema_path)
                    }, {
                        name: 'schema-loaded',
                        data: { schema_path: schema_path }
                    });
                }
                catch (e) {
                    consola_1.default.error(e);
                    var error = new error_1.UnableToLoadSchema(schema_path);
                    _this.speak(null, { name: 'error', data: { error: error } });
                    throw error;
                }
                _this.add({
                    route: route,
                    schema_processor: _this.processor
                });
                _this.speak({
                    level: 'success',
                    message: "Successfully hosted route '".concat(route, "'.")
                }, {
                    name: 'route-hosted',
                    data: { route: route }
                });
            });
        });
    };
    EskiServer.prototype.loadProcessor = function (_a) {
        var _this = this;
        var processor = _a.processor, custom_primitives = _a.custom_primitives;
        var primitives_module = {};
        if (custom_primitives) {
            custom_primitives.forEach(function (module) {
                try {
                    primitives_module = require(path_1.default.resolve(process.cwd(), module));
                    _this.speak(null, { name: 'primitive-loaded', data: { module: module } });
                }
                catch (e) {
                    consola_1.default.error(e);
                    if (e.message.includes('MODULE_NOT_FOUND')) {
                        var error = new error_1.CustomPrimitivesPathInvalid(module);
                        _this.speak(null, { name: 'error', data: { error: error } });
                        throw error;
                    }
                }
                Object.keys(primitives_module).forEach(function (eachPrimitive) {
                    processor.register(eachPrimitive, primitives_module[eachPrimitive]);
                    _this.speak({
                        level: 'success',
                        message: "Successfully registered primitive '".concat(eachPrimitive, "' from ").concat(path_1.default.relative(process.cwd(), module), ".")
                    }, {
                        name: 'primitive-registered',
                        data: { eachPrimitive: eachPrimitive }
                    });
                });
            });
        }
    };
    EskiServer.prototype.start = function (callback) {
        var _this = this;
        if (!this.routes_configuration) {
            var error = new error_1.RouteConfigurationsNotProvided();
            this.speak(null, { name: 'error', data: { error: error } });
            throw error;
        }
        else if (!this.isServerUp()) {
            var error = new error_1.ServerNotUp();
            this.speak(null, { name: 'error', data: { error: error } });
            throw error;
        }
        // Loading Processor with Custom Primitives
        var message = this.custom_primitives ? "Adding primitives from ".concat(this.custom_primitives, ".") : "No custom primitives registered.";
        this.speak({
            level: 'info',
            message: message
        }, {
            name: 'info',
            data: { message: message }
        });
        this.loadProcessor({
            processor: this.processor,
            custom_primitives: this.custom_primitives
        });
        this.loadRoutes({ routes_configuration: this.routes_configuration });
        // Starting Eski Server
        message = "Starting Eski Server.";
        this.speak({
            level: 'info',
            message: message
        }, {
            name: 'info',
            data: { message: message }
        });
        this.httpServer = this.server.listen(this.port, function () {
            _this.speak({
                level: 'success',
                message: "Eski is running on port ".concat(_this.port)
            }, {
                name: 'started',
                data: { port: _this.port }
            });
            if (callback) {
                consola_1.default.info('Executing callback...');
                callback();
            }
        });
    };
    EskiServer.prototype.add = function (_a) {
        var _this = this;
        var route = _a.route, schema_processor = _a.schema_processor;
        if (this.isServerUp())
            this.server.get(route, function (req, res) {
                var response = schema_processor.process();
                var code = 200;
                res.status(code).jsonp(response);
                _this.emitter.emit('response', { route: route, response: response, code: code });
            });
    };
    EskiServer.prototype.stop = function () {
        if (this.httpServer) {
            this.httpServer.close();
            var message = "Server on port ".concat(this.port, " was stopped!");
            this.speak({
                level: 'info',
                message: message
            }, {
                name: 'info',
                data: { message: message }
            });
        }
    };
    return EskiServer;
}());
exports.default = EskiServer;
