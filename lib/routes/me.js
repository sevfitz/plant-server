const Router = require('express').Router;
const router = Router();
const User = require('../models/User');

router
    .get('/', (req, res, next) => {
        User.findById(req.user.id)
            .lean()
            .select('name email myCards')
            .select('-_id')
            .then(user => {
                if(!user) return next({ code: 404 });
                res.send(user);
            })
            .catch(next);
    });

module.exports = router;