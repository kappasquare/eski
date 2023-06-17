import 'dart:io';
import 'package:args/args.dart';
import 'package:eski/http-server.dart';

Future<void> main(List<String> args) async {
  var parser = ArgParser();
  parser.addOption('port', help: 'The port to start the Eski server on.');
  try {
    start(parser.parse(args));
  } catch (error) {
    if (error is! ArgParserException) rethrow;
    print(
        '\nUnknown option provided. Allowed options are: \n\n ${parser.usage}\n');
    exit(64);
  }
}

start(ArgResults pargs) async {
  final server = await createServer(pargs['port'] ?? 3000);
  print('Server started on ${server.address.address}:${server.port}');
  await handleRequests(server);
}
