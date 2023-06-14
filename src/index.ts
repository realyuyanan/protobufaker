import {
  ReflectionObject,
  Root,
  Field,
  Namespace as ParentType,
  Enum
} from "protobufjs";
import * as protobufjs from "protobufjs";
import * as fs from "fs";
import {
  BASE_FILED_TYPE,
  BASE_TYPE,
  getMockValue,
  getRandomNumber,
  getRandomValue
} from "./get-mock-value";

const makeValueWithEnumType = (enumType: Enum) => {
  const { values } = enumType.toJSON();
  return getRandomValue(Object.keys(values));
};

export type FakerConfig = {
  name?: string;
  path: string;
  enableCache?: boolean;
  keepCase?: boolean;
  formatConfig?: Record<string, string>
}

export default class Protobufaker {
  public keepCase = true;
  public name;
  public formatConfig: Record<string, any> = {};

  private enableCache = false;

  private pbParseContext: Root;

  private cache: Record<string, any> = {};

  constructor(config: FakerConfig) {
    const {
      name,
      enableCache,
      keepCase,
      path: absolutePbPath,
      formatConfig
    } = config;
    this.enableCache = enableCache;
    this.keepCase = keepCase;
    this.name = name || absolutePbPath;
    this.formatConfig = formatConfig;

    let readStream = fs.createReadStream(absolutePbPath, "utf-8");

    let pbFileContent = "";
    const pbFileContentArray: string[] = [];
    readStream.on("data", (buffer: string) => {
      pbFileContentArray.push(buffer);
    });

    readStream.on("end", () => {
      pbFileContent = pbFileContentArray.join("");
      const pbParseContext = protobufjs.parse(pbFileContent, {
        keepCase
      }).root;

      this.pbParseContext = pbParseContext;

      if (enableCache) {
        this.cache[name] = {};
      }

      readStream.close();
      readStream = null;
    });
  }

  public findValue(name: string) {
    const { pbParseContext, enableCache, cache } = this;
    const context = pbParseContext.lookup(name);
    if (enableCache) {
      if (typeof cache[name] === "undefined") {
        cache[name] = this.makeValue(context);
      }

      return cache[name];
    }

    return this.makeValue(name);
  }

  private makeValue(
    typeOrTypeName: string | ReflectionObject,
    rule?: string,
    parent?: ParentType,
    name?: string
  ): (Record<string, any> | any[] | any) {
    if (typeOrTypeName instanceof protobufjs.Type) {
      return this.parseFields(typeOrTypeName.fields);
    }

    if (BASE_FILED_TYPE[typeOrTypeName as BASE_TYPE]) {
      return this.makeValueWithBaseType(typeOrTypeName as BASE_TYPE, name);
    }

    if (rule === "repeated") {
      return this.makeValueWithRepeatedRule(typeOrTypeName, parent);
    }

    try {
      const complexType = parent.lookup(typeOrTypeName as string);
      if (complexType instanceof protobufjs.Enum) {
        return makeValueWithEnumType(complexType);
      }

      if (complexType instanceof protobufjs.Type) {
        return this.parseFields(complexType.fields);
      }
    } catch (e) {
      return `Got error while parse "${typeOrTypeName}", ${e}`;
    }
  }

  private makeValueWithBaseType(
    type: BASE_TYPE,
    name: string
  ) {
    return getMockValue(type, this.formatConfig[name]);
  }

  private makeValueWithRepeatedRule(
    type: string | ReflectionObject,
    parent: ParentType
  ) {
    const parsedValue = [];
    const randomLength = getRandomNumber();
    for (let i = 0; i < randomLength; i += 1) {
      parsedValue.push(this.makeValue(type, "", parent));
    }

    return parsedValue;
  }

  private parseFields(fields: Record<string, Field>) {
    const parsedValue: Record<string, any> = {};
    Object.keys(fields).forEach((fieldKey) => {
      const field = fields[fieldKey];
      const {
        name, type, rule, parent
      } = field;
      parsedValue[name] = this.makeValue(type, rule, parent, name);
    });

    return parsedValue;
  }
}
