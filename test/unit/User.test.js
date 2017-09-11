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
});