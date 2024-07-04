const {model, Schema} = require('./index');

const transactionSchema = Schema({
    user: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;