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
  db.User.createSecure(new_user.email, new_user.password, function(err, user) {
    if (err) { return console.log(err); }
    console.log("---> One user added");
    console.log(user);
    process.exit();
  });

});
