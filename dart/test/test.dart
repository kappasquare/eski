import 'dart:convert';

import 'package:eski/events-handler.dart';
import 'package:eski/server.dart';

var json = {
  "/api/v1": {
    "test1": "D:\\Projects\\eski\\example\\schema.json",
    "configurations": {"test1": "D:\\Projects\\eski\\example\\schema.json"}
  }
};

main() {
  var server = EskiServer(
      port: 3000,
      routes: RoutesConfiguration(json: jsonEncode(json)),
      mode: Mode.lib);
  server.on(EskiEvents.All, (data) {
    print(data);
  });
  // server.start();
}
