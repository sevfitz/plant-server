require('mongoose').Promise = Promise;
const assert = require('chai').assert;
const User = require('../../lib/models/User');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('User model', () => {

    it('new user generates hash and passes validation with required fields', () => {
        const user = new User({
            name: 'test user',
            email: 'test email',
            myCards: []
        });
        const password = 'abc';

        user.generateHash(password);

        assert.notEqual(user.hash, password);

        assert.isOk(user.comparePassword('abc'));
        assert.isNotOk(user.comparePassword('bad password'));
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

        it('fails validation with incorrect field type', () => {
            const user = new User({
                name: {},
                email: {},
                password: {},
                myCards: {}
            });
            return user.validate()
                .then(expectedValidation,
                    ({ errors }) => {
                        assert.ok(errors.name);
                    }
                );
        });
    });
});