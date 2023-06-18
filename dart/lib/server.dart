import 'dart:io';
import 'dart:convert';
import 'package:path/path.dart' as p;
import 'package:eski/constants.dart';
import 'package:eski/schema.dart';
import 'package:flat/flat.dart';
import 'package:eski/events-handler.dart';
import 'package:eski/http-server.dart';
import 'package:eski/logger.dart';

enum Mode { cli, lib }

class RoutesConfiguration {
  late final String? path;
  late final String? json;
  RoutesConfiguration({this.path, this.json}) {
    if (path == null || path!.isEmpty) {
      if (json == null || json!.isEmpty) {
        EventsHandler.throwRouteConfigurationsNotProvided();
      }
    } else if ((path != null && path!.isNotEmpty) &&
        (json != null && json!.isNotEmpty)) {
      EventsHandler.throwRouteConfigurationsConflict();
    }
  }
}

class EskiServer {
  late final int port;
  late final Mode mode;
  late final RoutesConfiguration? routes;
  late final Map<String, SchemaProcessor> processors = {};

  EskiServer({required this.port, this.routes, this.mode = Mode.cli}) {
    Logger.init();
    EventsHandler.init(mode);
    if (routes == null) EventsHandler.throwRouteConfigurationsNotProvided();
  }

  on(EskiEvents event, dynamic Function(dynamic) callback) {
    EventsHandler.on(event.name, callback);
  }

  bool isJsonMode() {
    return routes!.json != null && routes!.json!.isNotEmpty;
  }

  Future<Map<String, dynamic>> getRoutesContent() async {
    // TODO: Support json in CLI mode.
    if (isJsonMode() && mode == Mode.cli) {
      throw '--routes-json is not yet supported in cli mode!';
    }
    return isJsonMode()
        ? jsonDecode(routes!.json!)
        : jsonDecode(
            await File(p.absolute(p.current, routes!.path!)).readAsString());
  }

  String getSchemaAbsolutePath(String path) {
    var current =
        isJsonMode() ? p.dirname(p.current) : p.dirname(routes!.path!);
    return p.absolute(current, path);
  }

  Future<void> start() async {
    Map<String, dynamic> routesConfiguration = {};
    try {
      routesConfiguration = await getRoutesContent();
    } catch (e) {
      EventsHandler.shoutUnableToLoadRouteConfiguration(e.toString());
    }

    Map<dynamic, dynamic> routes = flattenJson(routesConfiguration);

    for (String key in routes.keys) {
      var route = key.replaceAll(FLATTEN_DELIMETER, PATH_DELIMETER);
      try {
        var path = getSchemaAbsolutePath(routes[key]);
        var schemaJson = jsonDecode(await File(path).readAsString());
        processors[route] = SchemaProcessor(schema: schemaJson);
        EventsHandler.shoutSuccessfullyHostedRoute(route);
      } catch (e) {
        EventsHandler.shoutUnableToHostRoute(route, e.toString());
      }
    }

    if (processors.isEmpty) EventsHandler.throwNoRoutesHosted();
    createServer(port).then((server) {
      EventsHandler.shoutServerStarted(
          server.address.host, port, processors.length);
      handleRequests(server, processors);
    }).catchError((e) {
      EventsHandler.throwUnableToStartServer(port, e.toString());
    });
  }

  Map<dynamic, dynamic> flattenJson(Map<String, dynamic> json) {
    return flatten(json, delimiter: FLATTEN_DELIMETER);
  }

  Future<Map<String, dynamic>> readJsonFile(String path) async {
    return jsonDecode(await File(path).readAsString());
  }
}
