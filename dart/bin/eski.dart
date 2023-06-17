import 'dart:io';
import 'package:args/args.dart';
import 'package:eski/constants.dart';
import 'package:eski/logger.dart';
import 'package:eski/server.dart';

Future<void> main(List<String> args) async {
  var parser = ArgParser();
  parser.addOption(CLI_OPTION_PORT,
      help: 'The port to start the Eski server on.',
      defaultsTo: '$DEFAULT_PORT');
  parser.addOption(CLI_OPTION_ROUTES,
      help: 'The path to the Eski schema to use.');
  try {
    start(parser.parse(args));
  } catch (error) {
    if (error is! ArgParserException) rethrow;
    if (error.toString().contains('Missing argument for')) {
      Logger.error(error.toString());
    } else {
      Logger.error(
          'Unknown option provided. Allowed options are: \n ${parser.usage}');
    }
    exit(64);
  }
}

start(ArgResults pargs) async {
  Logger.init();
  var server = EskiServer(
      port: int.parse(pargs[CLI_OPTION_PORT]),
      routes: pargs[CLI_OPTION_ROUTES]);
  server.start();
}
