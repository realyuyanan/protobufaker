const fakerjs = require('faker');

const COUNT = 5;

const getMockValue  = (type) => {
    if (type === 'string') {
        return fakerjs.name.findName();
    }
    return fakerjs.phone.phoneNumber();
};

const getRandomNumber = number => {
    let count = number || COUNT;
    return Math.round(count * Math.random());
};

const getRandomValue = array => {
    const { length } = array;
    const randomIndex = getRandomNumber(length);
    return randomIndex >= length ? array[randomIndex - 1] : array[randomIndex];
};

module.exports = {
    getMockValue,
    getRandomNumber,
    getRandomValue,
};