require('mongoose').Promise = Promise;
const assert = require('chai').assert;
const User = require('../../lib/models/User');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('User model', () => {

    it('validates a good model', () => {
        const user = new User({
            name: 'test user',
            email: 'test email',
            hash: 'test hash',
            myCards: []
        });
        return user.validate();
    });

    describe('validation failures', () => {

        it('fails if required fields are missing', () => {
            const user = new User();
            return user.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.name && errors.email && errors.hash);
                        assert.equal(errors.name.kind && errors.email.kind && errors.hash.kind, 'required');
                    });
        });
    });
});