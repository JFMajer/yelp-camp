const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// const encrypt = require('mongoose-encryption');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose);

// var encKey = process.env.ENCKEY;
// var sigKey = process.env.SIGKEY;

// UserSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });

module.exports = mongoose.model('User', UserSchema);