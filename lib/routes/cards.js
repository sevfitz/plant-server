const Router = require('express').Router;
const router = Router();
const Card = require('../models/Card');

router
    .get('/', (req, res, next) => {
        Card.find()
            .lean()
            .select('name genus species description url')
            .then(cards => res.send(cards))
            .catch(next);
    });


module.exports = router;
