// ignore: library_prefixes
import 'package:logging/logging.dart' as L;

final L.Logger _logger = L.Logger('EskiServer');

class Logger {
  static final _ = {
    "warning": {"color": "\x1B[33m", "tag": 'WARN'},
    "severe": {"color": "\x1B[31m", "tag": 'FAIL'},
    "fine": {"color": "\x1B[32m", "tag": 'PASS'},
    "info": {"color": "\x1B[34m", "tag": 'INFO'}
  };

  static init() {
    L.Logger.root.clearListeners();
    L.Logger.root.level = L.Level.ALL;
    L.Logger.root.onRecord.listen((record) {
      var level = record.level.name.toLowerCase();
      print('${_[level]!['color']}[${_[level]!['tag']}]'
          '[${record.time}] ${record.message}\x1B[0m');
    });
  }

  static info(String message) {
    _logger.info(message);
  }

  static success(String message) {
    _logger.fine(message);
  }

  static warn(String message) {
    _logger.warning(message);
  }

  static error(String message) {
    _logger.severe(message);
  }
}
