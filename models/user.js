var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// TODO#5 stop saving plain-text passwords in the database
// var bcrypt = require('bcrypt');

var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: {unique: true} // uniqueness constraint
  },
  password: {       // TODO#5 VERY BAD, plain-text password
    type: String,
    required: true
  }
});

// // create a new user with secure (hashed) password (for sign up)
// UserSchema.statics.createSecure = function (email, password, cb) {
//   // `_this` now references our schema
//   var _this = this;
//   // generate some salt
//   bcrypt.genSalt(function (err, salt) {
//     // hash the password with the salt
//     bcrypt.hash(password, salt, function (err, hash) {
//       // build the user object
//       var user = {
//         email: email,
//         passwordDigest: hash
//       };
//       // create a new user in the db with hashed password and execute the callback when done
//       _this.create(user, cb);
//     });
//   });
// };

// // authenticate user (for login)
// UserSchema.statics.authenticate = function (email, password, cb) {
//   // find user by email entered at log in
//   this.findOne({email: email}, function (err, user) {
//     // throw error if can't find user
//     if (user === null) {
//       cb("Can\'t find user with that email", null);
//     // if found user, check if password is correct
//     } else if (user.checkPassword(password)) {
//       // the user is found & password is correct, so execute callback
//       // pass no error, just the user to the callback
//       cb(null, user);
//     } else {
//       // user found, but password incorrect
//       cb("password incorrect", user)
//     }
//   });
// };

// // compare password user enters with hashed password (`passwordDigest`)
// UserSchema.methods.checkPassword = function (password) {
//   // run hashing algorithm (with salt) on password to compare with stored `passwordDigest`
//   // `compareSync` is like `compare` but synchronous
//   // returns true or false
//   return bcrypt.compareSync(password, this.passwordDigest);
// };


var User = mongoose.model('User', userSchema);

module.exports = User;
