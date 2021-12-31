const Protobufaker = require('../lib/index');
const path = require('path');

const faker = new Protobufaker({
    name: 'test',
    enablecache: true,
    keepCase: true,
    path: path.resolve(__dirname, './demo.proto'),
    formatConfig: {
        name: 'name',
        email: "email",
        number: 'phone',
        last_updated: 'date.soon',
        first_name: 'name.firstName',
        last_name: 'name.lastName',
        place: 'address',
    }
});

console.log(faker.findValue('Person'));
