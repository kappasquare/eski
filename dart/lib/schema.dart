// ignore_for_file: constant_identifier_names
import 'dart:math';

import 'package:eski/events-handler.dart';
import 'package:eski/primitives.dart';

// ignore: non_constant_identifier_names
final KEYWORD_SCHEMAKEY_MAP = {
  "IS": ":is",
  "KEY": ":key:",
  "VALUE": ":value",
  "CONDITIONS": ":conditions",
  "MIN_LENGTH": ":min_length",
  "MAX_LENGTH": ":max_length",
  "LIST": "list",
  "OBJECT": "object",
};

enum SCHEMA_KEYWORDS {
  IS,
  KEY,
  VALUE,
  CONDITIONS,
  MIN_LENGTH,
  MAX_LENGTH,
  LIST,
  OBJECT
}

String? rawSchemaKey(SCHEMA_KEYWORDS keyword) {
  return KEYWORD_SCHEMAKEY_MAP[keyword.name];
}

bool isListOrObject(String value) {
  return value == rawSchemaKey(SCHEMA_KEYWORDS.LIST) ||
      value == rawSchemaKey(SCHEMA_KEYWORDS.OBJECT);
}

bool checkIfList(String value) {
  return value == rawSchemaKey(SCHEMA_KEYWORDS.LIST);
}

String? getKey(String value) {
  return value.contains(rawSchemaKey(SCHEMA_KEYWORDS.KEY)!)
      ? value.split(rawSchemaKey(SCHEMA_KEYWORDS.KEY)!).last
      : null;
}

class SchemaProcessor {
  Map<String, dynamic> schema = {};
  Map<String, Map<String, int>> delay = {};
  SchemaProcessor({required this.schema});

  setDelay(String path, int min, int max) {
    if (min > max) max = min;
    delay[path] = {"min": min, "max": max};
  }

  _process(String key, Map<String, dynamic> schema) {
    // ignore: non_constant_identifier_names
    var IS = schema[rawSchemaKey(SCHEMA_KEYWORDS.IS)];
    if (IS == null) {
      EventsHandler.shoutIsNotProvided(key);
    } else {
      if (isListOrObject(IS)) {
        if (schema[rawSchemaKey(SCHEMA_KEYWORDS.VALUE)] == null) {
          EventsHandler.shoutValueNotProvided(key);
        }
        return checkIfList(IS)
            ? _processList(key, schema, [])
            : _processObject(key, schema, {});
      } else {
        return _processPrimitive(
            IS, schema[rawSchemaKey(SCHEMA_KEYWORDS.CONDITIONS)]);
      }
    }
  }

  process() {
    try {
      return _process('\$', schema);
    } catch (e) {
      if (e is! SchemaValidationException) rethrow;
    }
  }

  int between(int min, int max) {
    if (min == max) return min;
    return min + Random().nextInt(max - min);
  }

  _processList(String key, Map<String, dynamic> schema, List response) {
    var value = schema[rawSchemaKey(SCHEMA_KEYWORDS.VALUE)];
    if (value == null) return response;
    if (schema[rawSchemaKey(SCHEMA_KEYWORDS.MIN_LENGTH)] == null ||
        schema[rawSchemaKey(SCHEMA_KEYWORDS.MAX_LENGTH)] == null) {
      EventsHandler.shoutListConditionsNotProvided(key);
    }
    if (value[rawSchemaKey(SCHEMA_KEYWORDS.IS)] == null) {
      EventsHandler.shoutValueNotProvided(key);
    }

    for (int i = 0;
        i <
            between(schema[rawSchemaKey(SCHEMA_KEYWORDS.MIN_LENGTH)],
                schema[rawSchemaKey(SCHEMA_KEYWORDS.MAX_LENGTH)]);
        i++) {
      response.add(_process(key, value));
    }
    return response;
  }

  _processObject(
      String parentKey, Map<String, dynamic> schema, dynamic response) {
    Map<String, dynamic>? value = schema[rawSchemaKey(SCHEMA_KEYWORDS.VALUE)];
    if (value == null) {
      EventsHandler.shoutValueNotProvided(parentKey);
    } else {
      for (String rawKey in value.keys) {
        String? key = getKey(rawKey);
        if (key != null) {
          response[key] = _process('$parentKey.$key', value[rawKey]);
        } else {
          EventsHandler.shoutKeyNotProvided(parentKey);
        }
      }
    }
    return response;
  }

  Map<Symbol, dynamic> _symbolizeKeys(Map<String, dynamic> map) {
    return map.map((k, v) => MapEntry(Symbol(k), v));
  }

  _processPrimitive(String type, dynamic conditions) {
    var primitive = Primitives[type];
    if (primitive == null) {
      EventsHandler.shoutPrimitiveNotAvailable(type);
    }
    try {
      return Function.apply(primitive!, [], _symbolizeKeys(conditions ?? {}));
    } catch (e) {
      if (e.toString().contains('Closure call with mismatched arguments')) {
        EventsHandler.shoutInvalidConditionsForPrimitive(type, conditions);
      }
      rethrow;
    }
  }
}
