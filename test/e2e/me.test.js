const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('Users API', () => {

    const me = {
        name: 'logged in user',
        email: 'me@test.com',
        password: 'abc',
        myCards: []
    };
    let token = null;

    before(db.drop);
    before(() => {
        return request.post('/api/auth/signup')
            .send(me)
            .then(res => res.body)
            .then(t => token = t.token);
    });

    it('gets user\'s own account info', () => {
        return request.get('/api/me')
            .set('Authorization', token)
            .then(res => {
                delete me.password;
                const myInfo = res.body;
                assert.deepEqual(myInfo, me);
            });
    });

});

