const fakerjs = require('faker');

const BASE_FILED_TYPE = {
    // number
    double: ['datatype.float'],
    float: ['datatype.float'],
    int32: ['datatype.number'],
    uint32: ['datatype.number'],
    sint32: ['datatype.number'],
    fixed32: ['datatype.number'],
    sfixed32: ['datatype.number'],
    int64: ['datatype.number'],
    uint64: ['datatype.number'],
    sint64: ['datatype.number'],
    fixed64: ['datatype.number'],
    sfixed64: ['datatype.number'],
    // string
    string: ['address', 'animal', 'image', 'internet', 'lorem', 'music', 'name', 'phone', 'system', 'vehicle'],
    // boolean
    bool: ['boolean'],
};

const formatTest = /\{\{.+\}\}(\s?){1,}/;

const COUNT = 10;

const getRandomNumber = number => {
    let count = number || COUNT;
    return Math.round(count * Math.random());
};

const getRandomValue = array => {
    const { length } = array;
    const randomIndex = getRandomNumber(length);
    return randomIndex >= length ? array[randomIndex - 1] : array[randomIndex];
};

const getFormat = (type) => {
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

const getMockValue = (type, classificationOrFormat) => {
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

module.exports = {
    BASE_FILED_TYPE,
    getMockValue,
    getRandomNumber,
    getRandomValue,
}