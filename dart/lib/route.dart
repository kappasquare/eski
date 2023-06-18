// ignore: non_constant_identifier_names
import 'package:eski/constants.dart';
import 'package:eski/utils.dart';
import 'package:flat/flat.dart';

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

  static _processv2(Map<String, dynamic> config) {
    throw 'v2 not Implemented';
    // Map<dynamic, dynamic> flatConfig = flattenJson(config);
    // for (String key in flatConfig.keys) {
    //   String cleanKey = cleanFlatPath(key);
    //   print('$cleanKey=${flatConfig[key]}');
    //   if (key.startsWith(rawKey(KEYWORDS.ROUTES)!)) {}
    // }
  }

  static process(Map<String, dynamic> config) {
    return _processv1(config);
  }
}
