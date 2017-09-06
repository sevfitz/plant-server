require('mongoose').Promise = Promise;
const assert = require('chai').assert;
const Card = require('../../lib/models/Card');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Card model', () => {

    it('validates a good model', () => {
        const card = new Card({
            name: 'Test Name',
            genus: 'Test Genus',
            species: 'Test Species',
            description: 'Test Desc',
            url: 'something@something.com'
        });
        return card.validate();
    });

    describe('validation failures', () => {

        it('fails if required fields missing', () => {
            const card = new Card();
            return card.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.name && errors.genus && errors.species && errors.url && errors.description);
                        assert.ok((errors.name.kind && errors.genus.kind && errors.species.kind && errors.url.kind && errors.description.kind) === 'required');
                    });
        });
    });
});