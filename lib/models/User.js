const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    myCards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }]
});

schema.static('exists', function(query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

schema.method('generateHash', function(password) {
    this.hash = bcrypt.hashSync(password, 8);
});

schema.method('comparePassword', function(password) {
    return bcrypt.compareSync(password, this.hash);
});

module.exports = mongoose.model('User', schema);
