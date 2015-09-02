var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.statics.authenticate = function(username, password, cb) {
  this.findOne({username: username}, function(err, user){
      if ( user === null ){
        cb("Username does not exist", null);
      } else if ( user.password !== password ){
        cb("Incorrect password", null);
      } else {
        cb(null, user);
      }
  })
}

var User = mongoose.model('User', userSchema);

module.exports = User;
