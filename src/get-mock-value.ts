import fakerjs from 'faker';

enum BASE_TYPE {
  double = 'double',
  float = 'float',
  int32 = 'int32',
  uint32 = 'uint32',
  sint32 = 'sint32',
  fixed32 = 'fixed32',
  sfixed32 = 'sfixed32',
  int64 = 'int64',
  uint64 = 'uint64',
  sint64 = 'sint64',
  fixed64 = 'fixed64',
  sfixed64 = 'sfixed64',
  string = 'string',
  bool = 'bool', 
};

export const BASE_FILED_TYPE: Record<BASE_TYPE, Array<string>> = {
  // number
  [BASE_TYPE.double]:['datatype.float'],
  [BASE_TYPE.float]: ['datatype.float'],
  [BASE_TYPE.int32]: ['datatype.number'],
  [BASE_TYPE.uint32]: ['datatype.number'],
  [BASE_TYPE.sint32]: ['datatype.number'],
  [BASE_TYPE.fixed32]: ['datatype.number'],
  [BASE_TYPE.sfixed32]: ['datatype.number'],
  [BASE_TYPE.int64]: ['datatype.number'],
  [BASE_TYPE.uint64]: ['datatype.number'],
  [BASE_TYPE.sint64]: ['datatype.number'],
  [BASE_TYPE.fixed64]: ['datatype.number'],
  [BASE_TYPE.sfixed64]: ['datatype.number'],
  [BASE_TYPE.string]: ['address', 'animal', 'image', 'internet', 'lorem', 'music', 'name', 'phone', 'system', 'vehicle'],
  [BASE_TYPE.bool]: ['boolean'],
};

const formatTest = /\{\{.+\}\}(\s?){1,}/;

const COUNT = 10;

export const getRandomNumber = (number: number) => {
    let count = number || COUNT;
    return Math.round(count * Math.random());
};

export const getRandomValue = (array: Array<any>) => {
    const { length } = array;
    const randomIndex = getRandomNumber(length);
    return randomIndex >= length ? array[randomIndex - 1] : array[randomIndex];
};

const getFormat = (type: string) => {
  switch(type) {
    case 'boolean':
      return "{{datatype.boolean}}";
    case 'address':
      return "{{address.cityPrefix}} {{address.cityName}}";
    case 'animal':
      return "{{animal.type}}";
    case 'image':
      return "{{image.avatar}}";
    case 'internet':
      return "{{internet.url}}";
    case 'lorem':
      return "{{lorem.paragraph}}";
    case 'music':
      return "{{music.genre}}";
    case 'name':
      return "{{name.findName}}";
    case 'phone':
      return "{{phone.phoneNumber}}";
    case 'email':
      return "{{internet.email}}";
    case 'system':
      return "{{system.filePath}}";
    case 'vehicle':
      return "{{vehicle.vehicle}}";
    default:
      return `{{${type}}}`;
  }
};

export const getMockValue = (type: BASE_TYPE, classificationOrFormat: string) => {
    let format;
    if (typeof classificationOrFormat !== 'undefined') {
      if (formatTest.test(classificationOrFormat)) {
        return fakerjs.fake(classificationOrFormat);
      }
      format = getFormat(classificationOrFormat);
    } else {
      const classification = getRandomValue(BASE_FILED_TYPE[type]);
      format = getFormat(classification);
    }
    return fakerjs.fake(format);
};
