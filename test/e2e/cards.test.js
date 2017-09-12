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

    let testCard1 = {
        name: 'Test name1',
        genus: 'Test genus1',
        species: 'Test species1',
        description: 'Test description1',
        url: 'Test url1'
    };

    let testCard2 = {
        name: 'Test name2',
        genus: 'Test genus2',
        species: 'Test species2',
        description: 'Test description2',
        url: 'Test url2'
    };

    function saveCard (card) {
        return request
            .post('/api/cards')
            .send(card)
            .then(res => {
                let body = res.body;
                card._id = body._id;
                return card;
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

    it('gets a card by id', () => {
        const url = `/api/cards/${testCard._id}`;
        return request.get(url)
            .then(res => res.body)
            .then(card => assert.deepEqual(card, testCard));
    });

    it('Gets all cards', () => {
        return Promise.all([
            saveCard(testCard1),
            saveCard(testCard2)
        ])
            .then(savedCards => {
                testCard1 = savedCards[0];
                testCard2 = savedCards[1];
            })
            .then(() => request.get('/api/cards'))
            .then(res => res.body)
            .then(cards => assert.deepEqual(cards, [testCard,testCard1,testCard2]));
    });

    it('patches a card', () => {
        const url = `/api/cards/${testCard2._id}`;
        return request.patch(url)
            .send({ genus: 'something else' })
            .then(res => res.body)
            .then(res => assert.deepEqual(res.genus, 'something else'));
    });

    it('deletes a card', () => {
        const url = `/api/cards/${testCard2._id}`;
        return request.delete(url)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return res;
            })
            .then(() => request.delete(url))
            .then(res => assert.deepEqual(res.body, { removed: false }));
    });
});
