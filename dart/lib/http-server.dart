import 'dart:io';
import 'dart:convert';
import 'package:eski/constants.dart';
import 'package:eski/schema.dart';
import 'package:eski/events-handler.dart';
import 'package:faker/faker.dart';

Future<HttpServer> createServer(int port) async {
  final address = InternetAddress.loopbackIPv4;
  return await HttpServer.bind(address, port);
}

Future<void> handleRequests(
    HttpServer server, Map<String, SchemaProcessor> processors) async {
  await for (HttpRequest request in server) {
    var path = request.uri.toString();
    SchemaProcessor? processor = processors[path];
    if (processor != null) {
      switch (request.method) {
        case 'GET':
          handleGet(request, processor,
              minDelay: processor.delay[path]!['min']!,
              maxDelay: processor.delay[path]!['max']!);
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

void handleGet(HttpRequest request, SchemaProcessor processor,
    {int minDelay = 0, int maxDelay = 0}) {
  Future.delayed(Duration(
          milliseconds: faker.randomGenerator.integer(maxDelay, min: minDelay)))
      .then((_) {
    var eskiResponse = processor.process();
    int status = eskiResponse == null ? 500 : HttpStatus.ok;
    request.response.headers.contentType = ContentType.json;
    request.response
      ..statusCode = status
      ..write(jsonEncode(eskiResponse))
      ..close().then((_) {
        var message = '[${request.method}:${HttpStatus.ok}] ${request.uri}';
        EventsHandler.shoutOkResponse(message, {
          "data": eskiResponse,
          "method": request.method,
          "status": status,
          "path": request.uri.toString()
        });
      });
  });
}

void handleInvalidRequest(String message, HttpRequest request) {
  var response = {
    "error": '$message: ${request.uri}',
    "method": request.method,
    "status": HttpStatus.notFound,
    "path": request.uri.toString()
  };
  request.response.headers.contentType = ContentType.json;
  request.response
    ..statusCode = HttpStatus.methodNotAllowed
    ..write(jsonEncode(response))
    ..close().then((_) {
      var message = '[${request.method}:${HttpStatus.notFound}] ${request.uri}';
      EventsHandler.shoutErrorResponse(message, response);
    });
}
