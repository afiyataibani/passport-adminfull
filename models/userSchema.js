const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // unique: true
    },
    email: String,
    password: String,
    phone: Number
}, {
    timestamps: true
})

const user = mongoose.model('userModel', userSchema);

module.exports = user;