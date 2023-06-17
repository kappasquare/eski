import 'dart:convert';
import 'dart:io';
import 'package:eski/constants.dart';
import 'package:eski/schema.dart';
import 'package:flat/flat.dart';
import 'package:eski/errors.dart';
import 'package:eski/http-server.dart';
import 'package:eski/logger.dart';

class EskiServer {
  int port;
  String routes;
  Map<String, SchemaProcessor> processors = {};
  EskiServer({required this.port, this.routes = ''}) {
    if (routes.isEmpty) {
      Logger.error(
          'Please provide a path to the Eski schema using the --$CLI_OPTION_ROUTES CLI option.');
      throw routeConfigurationsNotProvidedException();
    }
  }

  Future<void> start() async {
    var routes = flattenJson(await readJsonFile(this.routes));
    for (String key in routes.keys) {
      var route = key.replaceAll(FLATTEN_DELIMETER, PATH_DELIMETER);
      try {
        processors[route] =
            SchemaProcessor(schema: await readJsonFile(routes[key]));
        Logger.success('Successfully hosted route $route');
      } catch (e) {
        continue;
      }
    }
    if (processors.isEmpty) {
      Logger.error('No routes were hosted! Check the path to the schemas.');
      throw 'No Routes Hosted ';
    }
    Logger.info('Hosted ${processors.length} routes!');
    createServer(port).then((server) {
      Logger.success(
          'Eski Server is running on $DEFAULT_PROTOCOL://${server.address.host}:$port');
      handleRequests(server, processors);
    }).catchError((e) {
      Logger.error(
          'Unable to start server on port $port. Error : ${e.toString()}');
    });
  }

  Map<dynamic, dynamic> flattenJson(Map<String, dynamic> json) {
    return flatten(json, delimiter: FLATTEN_DELIMETER);
  }

  Future<Map<String, dynamic>> readJsonFile(String path) async {
    if (await File(path).exists()) {
      return jsonDecode(await File(path).readAsString());
    } else {
      Logger.warn('Configuration at $path is invalid/unavailable!');
      throw routeConfigurationPathInvalidException(path);
    }
  }
}
