import fakerjs from "faker";

// eslint-disable-next-line no-shadow
export enum BASE_TYPE {
  double = "double",
  float = "float",
  int32 = "int32",
  uint32 = "uint32",
  sint32 = "sint32",
  fixed32 = "fixed32",
  sfixed32 = "sfixed32",
  int64 = "int64",
  uint64 = "uint64",
  sint64 = "sint64",
  fixed64 = "fixed64",
  sfixed64 = "sfixed64",
  string = "string",
  bool = "bool",
}

export const BASE_FILED_TYPE: Record<BASE_TYPE, Array<string>> = {
  // number
  [BASE_TYPE.double]: ["datatype.float"],
  [BASE_TYPE.float]: ["datatype.float"],
  [BASE_TYPE.int32]: ["datatype.number"],
  [BASE_TYPE.uint32]: ["datatype.number"],
  [BASE_TYPE.sint32]: ["datatype.number"],
  [BASE_TYPE.fixed32]: ["datatype.number"],
  [BASE_TYPE.sfixed32]: ["datatype.number"],
  [BASE_TYPE.int64]: ["datatype.number"],
  [BASE_TYPE.uint64]: ["datatype.number"],
  [BASE_TYPE.sint64]: ["datatype.number"],
  [BASE_TYPE.fixed64]: ["datatype.number"],
  [BASE_TYPE.sfixed64]: ["datatype.number"],
  // eslint-disable-next-line max-len
  [BASE_TYPE.string]: ["address", "animal", "image", "internet", "lorem", "music", "name", "phone", "system", "vehicle"],
  [BASE_TYPE.bool]: ["boolean"]
};

const formatTest = /\{\{.+\}\}(\s?){1,}/;

const COUNT = 10;

export const getRandomNumber = (number?: number) => {
  const count = number || COUNT;
  return Math.round(count * Math.random());
};

export const getRandomValue = (array: Array<string>) => {
  const { length } = array;
  const randomIndex = getRandomNumber(length);
  return randomIndex >= length ? array[randomIndex - 1] : array[randomIndex];
};

export const getMockValue = (
  type: BASE_TYPE,
  classificationOrFormat: string
) => {
  let format;
  if (typeof classificationOrFormat !== "undefined") {
    if (formatTest.test(classificationOrFormat)) {
      return fakerjs.fake(classificationOrFormat);
    }

    format = `{{${classificationOrFormat}}}`;
  } else {
    const classification = getRandomValue(BASE_FILED_TYPE[type]);
    format = `{{${classification}}}`;
  }

  return fakerjs.fake(format);
};
