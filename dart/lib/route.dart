// ignore_for_file: constant_identifier_names
import 'package:eski/utils.dart';

final KEYWORD_ROUTEKEY_MAP = {
  "SCHEMA": ":schema",
  "CONFIG": ":config",
  "MINDELAY": ":min-delay",
  "MAXDELAY": ":max-delay",
};

enum ROUTE_KEYWORDS { SCHEMA, CONFIG, MINDELAY, MAXDELAY }

class DelayThreshold {
  late final int minMs;
  late final int maxMs;
}

class RouteMeta {
  late DelayThreshold? delay;
}

class RouteConfig {
  late Map<dynamic, dynamic> pathToSchemaMap;
  late RouteMeta? meta;
  late List<RouteConfig>? children;
  RouteConfig({required this.pathToSchemaMap, this.meta, this.children});

  getDelay(String path) {
    return {
      "min": pathToSchemaMap['$path/${rawRouteKey(ROUTE_KEYWORDS.CONFIG)}'
              '/${rawRouteKey(ROUTE_KEYWORDS.MINDELAY)}'] ??
          0,
      "max": pathToSchemaMap['$path/${rawRouteKey(ROUTE_KEYWORDS.CONFIG)}'
              '/${rawRouteKey(ROUTE_KEYWORDS.MINDELAY)}'] ??
          0
    };
  }
}

String? rawRouteKey(ROUTE_KEYWORDS keyword) {
  return KEYWORD_ROUTEKEY_MAP[keyword.name];
}

class RouteConfigProcessor {
  static late final RouteConfig _config;

  static _processv1(Map<String, dynamic> config) {
    return RouteConfig(pathToSchemaMap: flattenJson(config));
  }

  static getConfig() {
    return _config;
  }

  static process(Map<String, dynamic> config) {
    return _processv1(config);
  }
}
