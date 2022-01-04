# protobufaker
<p align="center">
![](./logo.jpeg?raw=true 'protobufaker')
</p>

# demo

```
npm install protobufaker --save
```

```
const Protobufaker = require('protobufaker');
const faker = new Protobufaker({
    name: 'test',
    enablecache: true, // Whether to cache mock data
    keepCase: true,
    path: path.resolve(__dirname, './demo.proto'), // absolute path
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

faker.findValue('Person');
```
