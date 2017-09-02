const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('images api', () => {

    before(db.drop);

    let testCard = {
        name: 'Test name',
        genus: 'Test genus',
        species: 'Test species',
        description: 'Test description',
        url: 'Test url'
    };

    function saveCard (card) {
        return request
            .post('/api/cards')
    }







});