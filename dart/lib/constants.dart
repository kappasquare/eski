// ignore_for_file: non_constant_identifier_names

import 'package:eski/server.dart';

final CLI_OPTION_PORT = "port";
final DEFAULT_PORT = 3000;
final DEFAULT_PROTOCOL = "http";
final CLI_OPTION_ROUTES_JSON = "routes-json";
final CLI_OPTION_ROUTES_PATH = "routes-path";
final CLI_OPTION_ROUTES_HELP =
    'The path/json to the Eski routes configuration to use.';
final CLI_OPTION_PORT_HELP = 'The port to start the Eski server on.';
final FLATTEN_DELIMETER = "/";
final PATH_DELIMETER = "/";
final DEFAULT_MODE = Mode.cli;
final ESKI_HEADER_TAG = "eski-header-";
final ESKI_HEADER_MIN_DELAY = "min-delay";
final ESKI_HEADER_MAX_DELAY = "max-delay";
