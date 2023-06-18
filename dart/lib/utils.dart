import 'dart:convert';
import 'dart:io';

import 'package:eski/constants.dart';
import 'package:flat/flat.dart';

String cleanFlatPath(String path) {
  return path
      .replaceAll(FLATTEN_DELIMETER, PATH_DELIMETER)
      .replaceAll('$PATH_DELIMETER$PATH_DELIMETER', PATH_DELIMETER);
}

Map<dynamic, dynamic> flattenJson(Map<String, dynamic> json) {
  return flatten(json, delimiter: FLATTEN_DELIMETER);
}

Future<Map<String, dynamic>> readJsonFile(String path) async {
  return jsonDecode(await File(path).readAsString());
}
