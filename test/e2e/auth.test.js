const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('Auth api', () => {

    before(db.drop);

    const expectedErrors = () => { throw new Error('expected errors'); };

    const user = {
        name: 'test name',
        email: 'test email',
        password: 'abc',
        myCards: []
    };
    
    const user2 = {
        name: 'test name2',
        email: 'test email2',
        password: 'abc2',
        myCards: []
    };

    before(() => {
        return request.post('/api/auth/signup')
            .send(user)
            .then(res => res.body);
    });

    describe('user management', () => {
        
        const badRequest = (url, data, code, error) =>
            request
                .post(url)
                .send(data)
                .then(expectedErrors,
                    res => {
                        assert.equal(res.status, code);
                        assert.equal(res.response.body.error, error);
                    }
                );

        it('signup requires email', () => 
            badRequest('/api/auth/signup', { password: 'abc' }, 400, 'name, email, and password are all required')
        );
        
        it('signup requires password', () => 
            badRequest('/api/auth/signup', { email: 'test email' }, 400, 'name, email, and password are all required')
        );

        let token = '';

        it('signup', () => {
            return request.post('/api/auth/signup')
                .send(user2)
                .then(res => res.body)
                .then(res => assert.ok(token = res.token));
        });

        it('can\'t use same email', () =>
            badRequest('/api/auth/signup', user2, 400, 'email in use')
        );

        it('signin requires email', () => 
            badRequest('/api/auth/signin', { password: 'abc' }, 400, 'name, email, and password are all required')
        );

        it('signin requires password', () =>
            badRequest('/api/auth/signin', { email: user2.email }, 400, 'name, email, and password are all required')
        );

        it('signin with wrong user', () =>
            badRequest('/api/auth/signin', { email: user2.email, password: user.password }, 401, 'Invalid Login')
        );

        it('signin with wrong password', () =>
            badRequest('/api/auth/signin', { email: user2.email, password: 'bad' }, 401, 'Invalid Login')
        );

        it('token is invalid', () =>
            request
                .get('/api/auth/verify')
                .set('Authorization', 'bad token')
                .then(expectedErrors,
                    res => assert.equal(res.status, 401)
                )
        );

        it('token is valid', () =>
            request
                .get('/api/auth/verify')
                .set('Authorization', token)
                .then(res => assert.ok(res.body))
        );
    });

    describe('unauthorized', () => {

        it('401 with no token', () => {
            return request
                .get('/api/auth/verify')
                .then(expectedErrors,
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'No Authorization Found');
                    });
        });

        it('403 with invalid token', () => {
            return request
                .get('/api/auth/verify')
                .set('Authorization', 'badtoken')
                .then(expectedErrors,
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'Authorization Failed');
                    });
        });
    });
});
