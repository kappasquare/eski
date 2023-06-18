import 'dart:io';
import 'dart:convert';
import 'package:eski/route.dart';
import 'package:eski/utils.dart';
import 'package:path/path.dart' as p;
import 'package:eski/schema.dart';
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

    RouteConfig config = RouteConfigProcessor.process(routesConfiguration);

    for (String key in config.pathToSchemaMap.keys) {
      var route = cleanFlatPath(key);
      if (route.endsWith(rawRouteKey(ROUTE_KEYWORDS.SCHEMA)!)) {
        try {
          var path =
              route.split("/${rawRouteKey(ROUTE_KEYWORDS.SCHEMA)}").first;
          var schemaPath = getSchemaAbsolutePath(config.pathToSchemaMap[key]);
          var schemaJson = jsonDecode(await File(schemaPath).readAsString());
          var processor = SchemaProcessor(schema: schemaJson);
          var delay = config.getDelay(path);
          processor.setDelay(path, delay['min'], delay['max']);
          processors[path] = processor;
          EventsHandler.shoutSuccessfullyHostedRoute(path);
        } catch (e) {
          EventsHandler.shoutUnableToHostRoute(route, e.toString());
        }
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
}
