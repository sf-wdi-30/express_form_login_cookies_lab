var db = require("./models");

var new_user = {
  email: "anon",
  password: "123"
};

// Clear Database
db.User.remove({}, function(err){

  if (err) { return console.log(err); }
  console.log("---> Database Wiped");

  // Seed Database
  db.User.create(new_user, function(err, user){
    if (err) { return console.log(err); }
    console.log("---> One user added");
    console.log(user);
    process.exit();
  });
// // use this db call AFTER we install bcrypt
  // db.User.createSecure(new_user.email, new_user.username, function(err, user){
  //   if (err) { return console.log(err); }
  //   console.log("---> One user added");
  //   console.log(user);
  //   process.exit();
  // });


});
