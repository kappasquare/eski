import 'dart:io';
import 'dart:convert';
import 'package:eski/events-handler.dart';
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
          handleInvalidRequest('Unsupported request', request);
          break;
      }
    } else {
      handleInvalidRequest('Invalid route', request);
    }
  }
}

void handleGet(HttpRequest request, SchemaProcessor processor) {
  var response = processor.process();
  int status = response == null ? 500 : HttpStatus.ok;
  request.response
    ..statusCode = status
    ..write(jsonEncode(response))
    ..close().then((_) {
      var message = '[${request.method}:${HttpStatus.ok}] ${request.uri}';
      EventsHandler.shoutOkResponse(message, {
        "data": response,
        "method": request.method,
        "status": status,
        "path": request.uri
      });
    });
}

void handleInvalidRequest(String message, HttpRequest request) {
  var response = {
    "error": '$message: ${request.uri}.',
    "method": request.method,
    "status": HttpStatus.notFound,
    "path": request.uri
  };
  request.response
    ..statusCode = HttpStatus.methodNotAllowed
    ..write(jsonEncode(response))
    ..close().then((_) {
      var message = '[${request.method}:${HttpStatus.notFound}] ${request.uri}';
      EventsHandler.shoutErrorResponse(message, response);
    });
}
