import 'dart:convert';
import 'dart:io';

import 'package:eski/logger.dart';
import 'package:eski/schema.dart';

Future<HttpServer> createServer(int port) async {
  final address = InternetAddress.loopbackIPv4;
  return await HttpServer.bind(address, port);
}

Future<void> handleRequests(
    HttpServer server, Map<String, SchemaProcessor> processors) async {
  await for (HttpRequest request in server) {
    SchemaProcessor? processor = processors[request.uri.toString()];
    if (processor != null) {
      switch (request.method) {
        case 'GET':
          handleGet(request, processor);
          break;
        default:
          handleUnsupported(request);
          break;
      }
    } else {
      request.response
        ..statusCode = HttpStatus.notFound
        ..write(jsonEncode({"error": 'Unsupported path: ${request.uri}.'}))
        ..close().then((_) {
          Logger.error(
              '[${request.method}:${HttpStatus.notFound}] ${request.uri}');
        });
    }
  }
}

void handleGet(HttpRequest request, SchemaProcessor processor) {
  request.response
    ..statusCode = HttpStatus.ok
    ..write(jsonEncode(processor.process()))
    ..close().then((_) {
      Logger.success('[${request.method}:${HttpStatus.ok}] ${request.uri}');
    });
}

void handleUnsupported(HttpRequest request) {
  request.response
    ..statusCode = HttpStatus.methodNotAllowed
    ..write(jsonEncode({"error": 'Unsupported request: ${request.method}.'}))
    ..close().then((_) {
      Logger.warn(
          '[${request.method}:${HttpStatus.methodNotAllowed}] ${request.uri}');
    });
}
