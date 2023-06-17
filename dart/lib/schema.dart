import 'dart:math';

final KEYWORD_SCHEMAKEY_MAP = {
  "IS": ":is",
  "KEY": ":key:",
  "VALUE": ":value",
  "CONDITIONS": ":conditions",
  "MIN_LENGTH": ":min_length",
  "MAX_LENGTH": ":max_length",
  "LIST": "list",
  "OBJECT": "object"
};

enum KEYWORDS {
  IS,
  KEY,
  VALUE,
  CONDITIONS,
  MIN_LENGTH,
  MAX_LENGTH,
  LIST,
  OBJECT
}

rawKey(KEYWORDS keyword) {
  return KEYWORD_SCHEMAKEY_MAP[keyword.name];
}

isListOrObject(String value) {
  return value == rawKey(KEYWORDS.LIST) || value == rawKey(KEYWORDS.OBJECT);
}

checkIfList(String value) {
  return value == rawKey(KEYWORDS.LIST);
}

getKey(String value) {
  return value.contains(rawKey(KEYWORDS.KEY)!)
      ? value.split(rawKey(KEYWORDS.KEY)!).last
      : false;
}

class SchemaProcessor {
  Map<String, dynamic> schema = {};
  SchemaProcessor({required this.schema});

  _process(Map<String, dynamic> schema) {
    // ignore: non_constant_identifier_names
    var IS = schema[rawKey(KEYWORDS.IS)];
    if (isListOrObject(IS)) {
      if (schema[rawKey(KEYWORDS.VALUE)] == null) {
        throw ('Value not found!');
      }
      return checkIfList(IS)
          ? _processList(schema, [])
          : _processObject(schema, {});
    } else {
      return _processPrimitive(IS, schema[rawKey(KEYWORDS.CONDITIONS)]);
    }
  }

  process() {
    return _process(schema);
  }

  int between(int min, int max) {
    if (min == max) return min;
    return min + Random().nextInt(max - min);
  }

  _processList(Map<String, dynamic> schema, List response) {
    var value = schema[rawKey(KEYWORDS.VALUE)];
    if (schema[rawKey(KEYWORDS.MIN_LENGTH)] == null ||
        schema[rawKey(KEYWORDS.MAX_LENGTH)] == null) {
      throw 'ListConditionsNotFound';
    }
    if (value[rawKey(KEYWORDS.IS)] == null) {
      throw 'ListValueIsNotFound';
    }

    for (int i = 0;
        i <
            between(schema[rawKey(KEYWORDS.MIN_LENGTH)],
                schema[rawKey(KEYWORDS.MAX_LENGTH)]);
        i++) {
      response.add(_process(value));
    }
    return response;
  }

  _processObject(Map<String, dynamic> schema, dynamic response) {
    Map<String, dynamic> value = schema[rawKey(KEYWORDS.VALUE)];
    for (String key in value.keys) {
      var extractedKey = getKey(key);
      if (extractedKey != null) {
        response[extractedKey] = _process(value[key]);
      }
    }
    return response;
  }

  _processPrimitive(String type, dynamic conditions) {
    return 'test';
  }
}
