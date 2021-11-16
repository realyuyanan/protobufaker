const fs = require('fs');
const path = require('path');
const pbPath = path.resolve(__dirname, '../demo/demo.proto');
const pbFileContent = fs.readFileSync(pbPath).toString('utf-8');
const { getMockValue, getRandomNumber, getRandomValue } = require('./get-value');

const simpleTypeMap = ['int32', 'string', 'uint64', 'bytes'];


const parseFileds = (fields) => {
    const res = {};
    Object.keys(fields).forEach(fieldKey => {
        const field = fields[fieldKey];
        const { name, type, rule, parent } = field;
        res[name] = generate(type, rule, parent);
    });
    return res;
}

const generate = (type, rule, parent) => {
    if (typeof type === 'object') {
        return parseFileds(type.fields)
    }
    if (simpleTypeMap.indexOf(type) > -1) {
        return type === 'int32' || type === 'unit64' ? getMockValue('number') : getMockValue('string');
    }
    let value;
    if (rule === 'repeated') {
        value = new Array();
        const randomLength = getRandomNumber();
        for(let i = 0; i < randomLength; i += 1) {
            value.push(generate(type, '', parent));
        }
        return value;
    }
    
    try {
        const complexType = parent.lookup(type);
        const { values, fields } = complexType.toJSON();
        // enum
        if (values) {
            return getRandomValue(Object.keys(values));
        } else {
            return parseFileds(complexType.fields);
        }
    } catch (e) {
        return `get error while parse "${type}"`;
    }
};

const protobuf = require('protobufjs');
const root = protobuf.parse(pbFileContent, {
    keepCase: true
}).root;

const Person = root.lookup('Person');
console.log('get fake data for Person', generate(Person));

const AddressBook = root.lookup('AddressBook');
console.log('get fake data for AddressBook', generate(AddressBook));
