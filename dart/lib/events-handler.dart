// ignore_for_file: constant_identifier_names
import 'package:args/args.dart';
import 'package:eski/constants.dart';
import 'package:eski/logger.dart';
import 'package:eski/server.dart';
import 'package:events_emitter/emitters/event_emitter.dart';

class SchemaValidationException implements Exception {
  const SchemaValidationException();
}

class EskiException implements Exception {
  final String msg;
  final EskiEvents type;
  const EskiException(this.msg, this.type);
  @override
  String toString() => '[${type.name}] $msg';
}

class EventsHandler {
  static Mode _mode = Mode.cli;
  static late final bool inited;
  static late final EventEmitter? events;

  static init(Mode mode) {
    EventsHandler._mode = mode;
    try {
      events = mode == Mode.lib ? EventEmitter() : null;
      inited = mode == Mode.lib ? events != null : true;
    } catch (e) {
      throw EskiException(
          'Unable to init EventsHandler. Error: ${e.toString()}',
          EskiEvents.UnableToStartServer);
    }
  }

  static EventEmitter? get _events {
    if (events != null) return events;
    var message =
        'Are you running on cli mode? Cannot listen to Eski events on cli mode. '
        'Switch to lib mode to listen to events.';
    Logger.warn(message);
  }

  static on(String event, dynamic Function(dynamic) callback) {
    if (_events != null) _events!.on(event, callback);
  }

  static get isCliMode {
    return _mode == Mode.cli;
  }

  static _emit(EskiEvents event, dynamic data) {
    _events!.emit(event.name, data);
    _events!.emit(EskiEvents.All.name, data);
  }

  static _throw(String message, Mode mode, EskiEvents type) {
    isCliMode
        ? throw EskiException(Logger.colorize(message, 'severe'), type)
        : _events!.emit(type.name, message);
  }

  static throwUnableToLoadRouteConfiguration(String message) {
    _throw(message, Mode.cli, EskiEvents.UnableToLoadRouteConfiguration);
  }

  static throwCliOptionsParsingError(Object error, String usage) {
    var message = error.toString().contains('FormatException')
        ? error.toString()
        : error is ArgParserException
            ? 'Unknown option provided. Allowed options are: \n $usage'
            : error.toString();
    _throw(message, Mode.cli, EskiEvents.CliOptionsParsingError);
  }

  static throwRouteConfigurationsNotProvided() {
    var message = 'Please provide either --$CLI_OPTION_ROUTES_JSON or '
        '--$CLI_OPTION_ROUTES_PATH CLI option.';
    _throw(message, _mode, EskiEvents.RouteConfigurationsNotProvided);
  }

  static throwRouteConfigurationsConflict() {
    var message =
        'Both path and json for Routes Configuration was provided to Eski Server. '
        'Provide only either one of them.';
    _throw(message, _mode, EskiEvents.RouteConfigurationsConflict);
  }

  static throwNoRoutesHosted() {
    var message =
        'No routes were hosted! Check your route/schema configurations.';
    _throw(message, _mode, EskiEvents.NoRoutesHosted);
  }

  static throwUnableToStartServer(int port, String error) {
    var message = 'Unable to start server on port $port. Error : $error';
    _throw(message, _mode, EskiEvents.UnableToStartServer);
  }

  static shoutServerStarted(String host, int port, int routeCount) {
    var message = 'Eski Server is running on '
        '$DEFAULT_PROTOCOL://$host:$port with '
        '$routeCount hosted routes.';
    isCliMode
        ? Logger.success(message)
        : _emit(EskiEvents.ServerStarted, {
            "host": host,
            "port": port,
            "route_count": routeCount,
            "message": message
          });
  }

  static shoutUnableToLoadSchema(String path, String error) {
    var message = 'Unable to load schema from ($path). Error: $error';
    isCliMode
        ? Logger.warn(message)
        : _emit(EskiEvents.UnableToLoadSchema,
            {"path": path, "message": message, "error": error});
  }

  static shoutOkResponse(String message, dynamic data) {
    isCliMode ? Logger.success(message) : _emit(EskiEvents.Response, data);
  }

  static shoutErrorResponse(String message, dynamic data) {
    isCliMode ? Logger.error(message) : _emit(EskiEvents.Response, data);
  }

  static shoutUnableToLoadRouteConfiguration(String error) {
    var message = 'Unable to load route configurations. Error: $error';
    isCliMode
        ? throw throwUnableToLoadRouteConfiguration(message)
        : _emit(EskiEvents.UnableToLoadRouteConfiguration, {"error": error});
  }

  static shoutSuccessfullyHostedRoute(String route) {
    var message = 'Successfully hosted route $route';
    isCliMode
        ? Logger.info(message)
        : _emit(EskiEvents.SuccessfullyHostedRoute,
            {"route": route, "message": message});
  }

  static shoutUnableToHostRoute(String route, String error) {
    var message = 'Unable to host route $route. Error: $error';
    isCliMode
        ? Logger.warn(message)
        : _emit(EskiEvents.UnableToHostRoute,
            {"route": route, "message": message, "error": error});
  }

  static _shoutSchemaValidationException(
      EskiEvents event, String key, String message) {
    if (isCliMode) {
      _throw(message, _mode, event);
    } else {
      _emit(event, {"key": key, "message": message});
      throw SchemaValidationException();
    }
  }

  static shoutValueNotProvided(String key) {
    var message = '(:value) was not provided at path $key';
    _shoutSchemaValidationException(EskiEvents.ValueNotProvided, key, message);
  }

  static shoutIsNotProvided(String key) {
    var message = '(:is) was not provided at path $key';
    _shoutSchemaValidationException(EskiEvents.IsNotProvided, key, message);
  }

  static shoutKeyNotProvided(String key) {
    var message = 'Object at $key has children with missing (:key:)';
    _shoutSchemaValidationException(EskiEvents.KeyNotProvided, key, message);
  }

  static shoutListConditionsNotProvided(String key) {
    var message =
        'List at $key has missing (:min_length:) or (:max_length:) conditions';
    _shoutSchemaValidationException(
        EskiEvents.ListConditionsNotProvided, key, message);
  }
}

enum EskiEvents {
  All,
  Response,
  CliOptionsParsingError,
  NoRoutesHosted,
  ServerStarted,
  ServerStopped,
  SuccessfullyHostedRoute,
  ListConditionsNotProvided,
  IsNotProvided,
  ValueNotProvided,
  KeyNotProvided,
  PrimitiveMissing,
  ConditionsMissing,
  PrimitiveNotDefined,
  SchemaInvalid,
  UnableToHostRoute,
  UnableToLoadCustomPrimitives,
  UnableToLoadRouteConfiguration,
  UnableToLoadSchema,
  UnableToStartServer,
  RouteConfigurationsNotProvided,
  RouteConfigurationsConflict
}
