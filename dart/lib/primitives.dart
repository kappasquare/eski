// ignore_for_file: non_constant_identifier_names
import 'package:faker/faker.dart';

final _faker = Faker();

class CharSets {
  static final lowercase = 'abcdefghijklmnopqrstuvwxyz';
  static final uppercase = 'ABCDEFGHIJKLMONPQESTUVWXYZ';
  static final numbers = '1234567890';
  static final special = "-._!\"`'#%&,:;<>=@{}~\$()*+/\\?[]^|";

  static getCharsSet({
    bool uppercase = true,
    bool lowercase = true,
    bool numbers = true,
    bool special = true,
  }) {
    var set = '';
    if (uppercase) set += CharSets.uppercase;
    if (lowercase) set += CharSets.lowercase;
    if (numbers) set += CharSets.numbers;
    if (special) set += CharSets.special;
    return set;
  }
}

final Primitives = {
  "zipCode": _faker.address.zipCode,
  "city": _faker.address.city,
  "city_prefix": _faker.address.cityPrefix,
  "city_suffix": _faker.address.citySuffix,
  "street_name": _faker.address.streetName,
  "street_address": _faker.address.streetAddress,
  "street_suffix": _faker.address.streetSuffix,
  "building_number": _faker.address.buildingNumber,
  "neighborhood": _faker.address.neighborhood,
  "state": _faker.address.state,
  "state_abbreviation": _faker.address.stateAbbreviation,
  "state_as_map": _faker.address.stateAsMap,
  "country": _faker.address.country,
  "country_code": _faker.address.countryCode,
  "continent": _faker.address.continent,
  "conference_name": _faker.conference.name,
  "color": _faker.color.color,
  "common_color": _faker.color.commonColor,
  "company_name": _faker.company.name,
  "company_position": _faker.company.position,
  "company_suffix": _faker.company.suffix,
  "currency_code": _faker.currency.code,
  "currency_name": _faker.currency.name,
  "restaurant": _faker.food.restaurant,
  "cuisine": _faker.food.cuisine,
  "dish": _faker.food.dish,
  "longitude": _faker.geo.longitude,
  "latitude": _faker.geo.latitude,
  "image": _faker.image.image,
  "email": _faker.internet.email,
  "disposable_email": _faker.internet.disposableEmail,
  "free_email": _faker.internet.freeEmail,
  "safe_email": _faker.internet.safeEmail,
  "user_name": _faker.internet.userName,
  "domain_name": _faker.internet.domainName,
  "domain_word": _faker.internet.domainWord,
  "uri": _faker.internet.uri,
  "http_url": _faker.internet.httpUrl,
  "https_url": _faker.internet.httpsUrl,
  "ipv4": _faker.internet.ipv4Address,
  "ipv6": _faker.internet.ipv6Address,
  "mac": _faker.internet.macAddress,
  "password": _faker.internet.password,
  "user_agent": _faker.internet.userAgent,
  "guid": _faker.guid.guid,
  "job_title": _faker.job.title,
  "word": ({
    int min_length = 0,
    int max_length = 10,
    String charset = '',
    bool uppercase = true,
    bool lowercase = true,
  }) {
    var length = random.integer(max_length, min: min_length);
    return random.fromCharSet(
        charset.isNotEmpty
            ? charset
            : CharSets.getCharsSet(uppercase: uppercase, lowercase: lowercase),
        length);
  },
  "words": ({
    int count = 3,
    int word_length = 5,
    String charset = '',
    uppercase = true,
    lowercase = true,
  }) {
    var words = [];
    var randomCount = random.integer(count);
    List.generate(randomCount + 1, (__) {
      words.add(random.fromCharSet(
          charset.isNotEmpty
              ? charset
              : CharSets.getCharsSet(
                  uppercase: uppercase, lowercase: lowercase),
          random.integer(word_length)));
    });
    return words.join(" ");
  },
  "sentence": _faker.lorem.sentence,
  "sentences": ({int count = 3}) => _faker.lorem.sentences(count),
  "name": _faker.person.name,
  "first_name": _faker.person.firstName,
  "last_name": _faker.person.lastName,
  "prefix": _faker.person.prefix,
  "phone_number": ({String pattern = ''}) => random.fromPattern([pattern]),
  "vehicle_make": _faker.vehicle.make,
  "vehicle_model": _faker.vehicle.model,
  "vehicle_year": _faker.vehicle.year,
  "vehicle_year_make_model": _faker.vehicle.yearMakeModel,
  "vehicle_color_year_makemodel": _faker.vehicle.colorYearMakeModel,
  "vin": _faker.vehicle.vin,
  "month": _faker.date.month,
  "year": _faker.date.year,
  "date": () => random.integer(31, min: 1),
  "day": () => random.element([
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesay',
        'thurdsay',
        'friday'
      ]),
  "time": _faker.date.time,
  "just_time": _faker.date.justTime,
  "random_element_from_list": random.element,
  "random_key": random.mapElementKey,
  "random_value": random.mapElementValue,
  "boolean": random.boolean,
  "decimal": ({num scale = 1, num min = 0}) => random.decimal,
  "number_of_length": ({int length = 10}) => random.numberOfLength,
  "number": ({int min = 0, int max = 10}) => random.integer(max, min: min),
  "numbers_from_pattern": ({String pattern = "####"}) =>
      random.fromPattern([pattern]),
  "string_from_pattern": ({
    String charset = '',
    String pattern = "####",
    bool uppercase = true,
    bool lowercase = true,
    bool numbers = true,
    bool special = true,
  }) {
    return pattern.splitMapJoin(
      '#',
      onMatch: (_) => random.fromCharSet(
          charset.isNotEmpty
              ? charset
              : CharSets.getCharsSet(
                  uppercase: uppercase,
                  lowercase: lowercase,
                  numbers: numbers,
                  special: special,
                ),
          1),
    );
  },
  "from_charset": ({
    String charset = '',
    bool uppercase = true,
    bool lowercase = true,
    bool numbers = true,
    bool special = true,
    int length = 10,
  }) =>
      random.fromCharSet(
        charset.isNotEmpty
            ? charset
            : CharSets.getCharsSet(
                uppercase: uppercase,
                lowercase: lowercase,
                numbers: numbers,
                special: special,
              ),
        length,
      )
};
