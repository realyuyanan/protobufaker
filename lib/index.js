const protobuf = require('protobufjs');
const fs = require('fs');
const { BASE_FILED_TYPE, getMockValue, getRandomNumber, getRandomValue } = require('./get-mock-value');

class Protobufaker {
    enablecache = false;
    keepCase = true;
    formatConfig = {};
    // private
    pbParseContext;
    // private
    cache = {};
    constructor(config) {
        const { name, enablecache, keepCase, path: absolutePbPath, formatConfig } = config;
        this.enablecache = enablecache;
        this.keepCase = keepCase;
        this.name = name || absolutePbPath;
        this.formatConfig = formatConfig;
        try {
            const pbFileContent = fs.readFileSync(absolutePbPath).toString('utf-8');
            const pbParseContext = protobuf.parse(pbFileContent, {
                keepCase,
            }).root;
            this.pbParseContext = pbParseContext;
        } catch (e) {
            throw e;
        }
        if (enablecache) {
            this.cache[name] = {};
        }
    }
    findValue(name) {
        const { pbParseContext, enablecache, cache } = this;
        const context = pbParseContext.lookup(name);
        if (enablecache) {
            if (typeof cache[name] === 'undefined') {
                cache[name] = this.makeValue(context);
            }
            return cache[name];
        }
        return this.makeValue(name);
    }
    // private
    makeValue(typeOrTypeName, rule, parent, name) {
        if (typeOrTypeName instanceof protobuf.Type) {
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
                    if (complexType instanceof protobuf.Enum) {
                        return this.makeValueWithEnumType(complexType);
                    } else if (complexType instanceof protobuf.Type) {
                        return this.parseFileds(complexType.fields);
                    }
                } catch (e) {
                    return `get error while parse "${typeOrTypeName}"`;
                }
            }
        }
    }
    // private
    makeValueWithBaseType(type, name) {
        const formatConfig = this.formatConfig[name];
        return getMockValue(type, formatConfig);
    }
    // private
    makeValueWithRepeatedRule(type, parent) {
        const parsedValue = new Array();
        const randomLength = getRandomNumber();
        for(let i = 0; i < randomLength; i += 1) {
            parsedValue.push(this.makeValue(type, '', parent));
        }
        return parsedValue;
    }
    // private
    makeValueWithEnumType(enumType) {
        const { values } = enumType.toJSON();
        return getRandomValue(Object.keys(values));
    }
    parseFileds(fields) {
        const parsedValue = {};
        Object.keys(fields).forEach(fieldKey => {
            const field = fields[fieldKey];
            const { name, type, rule, parent } = field;
            parsedValue[name] = this.makeValue(type, rule, parent, name);
        });
        return parsedValue;
    }
}

module.exports = Protobufaker;