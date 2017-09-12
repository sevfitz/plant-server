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

    it('patches user\'s own account info', () => {
        return request.patch('/api/me')
            .set('Authorization', token)
            .send({ email: 'something different' })
            .then(() => request
                .get('/api/me')
                .set('Authorization', token)
            )
            .then(res => {
                me.email = 'something different';
                const newMe = res.body;
                assert.deepEqual(newMe, me);
            });
    });

    it('deletes user\'s own account', () => {
        return request.delete('/api/me')
            .set('Authorization', token)
            .then(res => assert.deepEqual(res.body, { removed: true }));
    });

    it('can\'t delete self if not there', () => {
        return request.delete('/api/me')
            .set('Authorization', token)
            .then(res => assert.deepEqual(res.body, { removed: false }));
    });
});

