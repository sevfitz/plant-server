const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('Cards api', () => {

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
            .send(card)
            .then(res => {
                let body = res.body;
                card.__v = body.__v;
                card._id = body._id;
                return body;
            });
    }

    it('Initial /GET returns empty list', () => {
        return request.get('/api/cards')
            .then(req => {
                const cards = req.body;
                assert.deepEqual(cards, []);
            });
    });

    it('saves a card', () => {
        return saveCard(testCard)
            .then(saved => {
                assert.deepEqual(saved, testCard);
            });
    });






});