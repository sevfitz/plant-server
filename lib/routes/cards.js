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
    })

    .get('/:id', (req, res, next) => {
        Card.findById(req.params.id)
            .lean()
            // .then(card => {
            //     if(!card) throw {
            //         code: 404,
            //         error: `card ${req.params.id} does not exist`
            //     };
            // })
            .select('name genus species description url')
            .then(card => res.send(card))
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        // const { body } = req;
        Card.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .then( card => res.send(card))
            .catch(next);
            
    })

    .post('/', (req, res, next) => {
        new Card(req.body)
            .save()
            .then(card => res.send(card))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Card.findByIdAndRemove(req.params.id)
            .then(response => res.send({ removed: !!response }))
            .catch(next);
    });

module.exports = router;
