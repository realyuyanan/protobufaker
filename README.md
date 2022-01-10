# protobufaker
<p align="center">
  <img src="./logo.jpeg" />
</p>

# demo

```
npm i protobufaker
```

```
const Protobufaker = require('protobufaker');
const faker = new Protobufaker({
    name: 'test',
    enablecache: true, // Whether to cache mock data
    keepCase: true,
    path: path.resolve(__dirname, './demo.proto'), // absolute path
    formatConfig: {
        name: 'name', // Available options refer to fakerjs.
        email: "email",
        number: 'phone',
        last_updated: 'date.soon',
        first_name: 'name.firstName',
        last_name: 'name.lastName',
        place: 'address',
    }
});

faker.findValue('Person');
```
