import 'dart:io';

Future<HttpServer> createServer(int port) async {
  final address = InternetAddress.loopbackIPv4;
  return await HttpServer.bind(address, port);
}

Future<void> handleRequests(HttpServer server) async {
  await for (HttpRequest request in server) {
    switch (request.method) {
      case 'GET':
        handleGet(request);
        break;
      default:
        handleDefault(request);
    }
  }
}

void handleGet(HttpRequest request) {
  request.response
    ..write({})
    ..close();
}

void handleDefault(HttpRequest request) {
  request.response
    ..statusCode = HttpStatus.methodNotAllowed
    ..write('Unsupported request: ${request.method}.')
    ..close();
}
