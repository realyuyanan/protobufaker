import * as protobufjs from 'protobufjs';
import * as fs from 'fs';
import { BASE_FILED_TYPE, getMockValue, getRandomNumber, getRandomValue } from './get-mock-value';

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
  public formatConfig = {};

  private enableCache = false;

  private pbParseContext;

  private cache: Record<string, any> = {};

  constructor(config: FakerConfig) {
    const { name, enableCache, keepCase, path: absolutePbPath, formatConfig } = config;
    this.enableCache = enableCache;
    this.keepCase = keepCase;
    this.name = name || absolutePbPath;
    this.formatConfig = formatConfig;
    try {
      const pbFileContent = fs.readFileSync(absolutePbPath).toString('utf-8');
      const pbParseContext = protobufjs.parse(pbFileContent, {
        keepCase,
      }).root;
      this.pbParseContext = pbParseContext;
    } catch (e) {
      throw e;
    }
    if (enableCache) {
      this.cache[name] = {};
    }
  }

  findValue(name: string) {
    const { pbParseContext, enableCache, cache } = this;
    const context = pbParseContext.lookup(name);
    if (enableCache) {
      if (typeof cache[name] === 'undefined') {
        cache[name] = this.makeValue(context);
      }
      return cache[name];
    }
    return this.makeValue(name);
  }

  private makeValue(typeOrTypeName: string | protobufjs.ReflectionObject, rule?: string, parent?: protobufjs.ReflectionObject, name?: string) {
    if (typeOrTypeName instanceof protobufjs.Type) {
      return this.parseFileds(typeOrTypeName.fields)
    }
    if (BASE_FILED_TYPE[typeOrTypeName]) {
      return this.makeValueWithBaseType(typeOrTypeName, name);
    } else {
      if (rule === 'repeated') {
        return this.makeValueWithRepeatedRule(typeOrTypeName, parent);
      } else {
        try {
          const complexType = parent.lookup(typeOrTypeName);
          if (complexType instanceof protobufjs.Enum) {
            return this.makeValueWithEnumType(complexType);
          } else if (complexType instanceof protobufjs.Type) {
            return this.parseFileds(complexType.fields);
          }
        } catch (e) {
          return `get error while parse "${typeOrTypeName}"`;
        }
      }
    }
  }

  private makeValueWithBaseType(type, name) {
    const formatConfig = this.formatConfig[name];
    return getMockValue(type, formatConfig);
  }

  private makeValueWithRepeatedRule(type, parent) {
    const parsedValue = new Array();
    const randomLength = getRandomNumber();
    for(let i = 0; i < randomLength; i += 1) {
      parsedValue.push(this.makeValue(type, '', parent));
    }
    return parsedValue;
  }

  private makeValueWithEnumType(enumType) {
    const { values } = enumType.toJSON();
    return getRandomValue(Object.keys(values));
  }

  private parseFileds(fields) {
    const parsedValue = {};
    Object.keys(fields).forEach(fieldKey => {
      const field = fields[fieldKey];
      const { name, type, rule, parent } = field;
      parsedValue[name] = this.makeValue(type, rule, parent, name);
    });
    return parsedValue;
  }
}

