class EskiException implements Exception {
  String cause;
  EskiException(this.cause);
}

routeConfigurationsNotProvidedException() {
  throw EskiException('Unable to start Eski! No route configuration provided!');
}

routeConfigurationPathInvalidException(String path) {
  throw EskiException('Unable to load route configurations from ($path)');
}
