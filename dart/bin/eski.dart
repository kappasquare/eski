import 'dart:convert';

import 'package:args/args.dart';
import 'package:eski/constants.dart';
import 'package:eski/events-handler.dart';
import 'package:eski/logger.dart';
import 'package:eski/server.dart';

Future<void> main(List<String> args) async {
  Logger.init();
  var parser = ArgParser();
  parser.addOption(CLI_OPTION_ROUTES_PATH, help: CLI_OPTION_ROUTES_HELP);
  parser.addOption(CLI_OPTION_ROUTES_JSON, help: CLI_OPTION_ROUTES_HELP);
  parser.addOption(CLI_OPTION_PORT,
      help: CLI_OPTION_PORT_HELP, defaultsTo: DEFAULT_PORT.toString());
  try {
    var pargs = parser.parse(args);
    EskiServer(
      port: int.parse(pargs[CLI_OPTION_PORT]),
      routes: RoutesConfiguration(
        path: pargs[CLI_OPTION_ROUTES_PATH],
        json: pargs[CLI_OPTION_ROUTES_JSON] == null
            ? null
            : jsonEncode(
                pargs[CLI_OPTION_ROUTES_JSON],
              ),
      ),
    ).start();
  } catch (error) {
    EventsHandler.throwCliOptionsParsingError(error, parser.usage);
  }
}
