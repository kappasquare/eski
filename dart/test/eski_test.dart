import 'package:eski/server.dart';
import 'package:test/test.dart';

void main() {
  test('Server start', () {
    var server = EskiServer(
        port: 3000,
        routes: RoutesConfiguration(
            path: 'D:\\Projects\\eski\\example\\routes.json'));
  });
}
