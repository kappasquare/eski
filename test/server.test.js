const {
    SchemaPathInvalid,
    RouteConfigurationsNotProvided,
    RouteConfigurationPathInvalid
} = require("../lib/error.js");
const {
    Server
} = require("../lib/index.js");

test("Eski Start Success", () => {
    const server = new Server();

    function start() {
        server.start({
            port: 5000,
            routes_configuration: "./data/valid_routes.json",
            callback: () => {
                throw new Error("Success");
            }
        });
    }
    expect(start).toThrow(new Error("Success"));
});

test("Eski GET Success", () => {
    const server = new Server();
    server.start({
        port: 5000,
        routes_configuration: "./data/valid_routes.json",
        callback: () => {
            //TODO: Logic using axios to GET and verify response.
        }
    });
});

test("Missing Route Configurations", () => {
    const server = new Server();

    function start() {
        server.start({
            port: 5000
        });
    }
    expect(start).toThrow(new RouteConfigurationsNotProvided());
});

test("Invalid Route Configuration Path", () => {
    const server = new Server();

    function start() {
        server.start({
            port: 5000,
            routes_configuration: "./data/invalid.json"
        });
    }
    expect(start).toThrow(new RouteConfigurationPathInvalid('./data/invalid.json'));
});

test("Invalid Schema Configuration Path", () => {
    const server = new Server();

    function start() {
        server.start({
            port: 5000,
            routes_configuration: "./data/invalid_routes.json"
        });
    }
    expect(start).toThrow(new SchemaPathInvalid('./test/data/schema1.json'));
});
