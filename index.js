var express = require("express"),
    app = express();

var path = require("path"),
    views_path = path.join(process.cwd(), "views");

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true})); // parse POSTed data
app.use(cookieParser()); // parse cookie data


/*
 * Data
 */

var mock_db = {
  User: [
    {
      username: "anon",
      password: "12345"
    }
  ]
}

/*
 * Routes
 */

app.get("/", function(req, res){
  res.send("Login Lab");
});

app.get("/login", function(req, res){
  var login_form = path.join(views_path, "login.html");
  res.sendFile(login_form);
});

app.get("/signup", function(req, res){
  var signup_form = path.join(views_path, "signup.html");
  res.sendFile(signup_form);
});

app.get("/profile", function(req, res){
  var guid = req.cookie.guid;
  // TODO_4: only display the profile to logged in users
  //            check their 'guid' cookie to verify authorization
  res.send({
    cookie: req.cookie,
    user: guid ? mock_db.User[guid] : "NOT FOUND"
  });
});

/*
 * API Endpoints
 */

app.post(["/login", "/api/sessions"], function createSession(req, res){
  console.log("Looks like you're trying to login!");
  // TODO_1: Authenticate user is who they say they are
  // TODO_1: Authorize user by setting a 'guid' cookie
  // TODO_1: redirect to profile
  res.redirect("/login");
});

app.get(["/logout", "/api/sessions"], function destroySession(req, res){
  console.log("Looks like you're trying to logout!");
  // TODO_2: delete 'guid' cookie
  res.redirect("/");
});

app.post(["/signup", "/api/users"], function createUser(req, res){
  console.log("Looks like you're trying to signup!");

  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    mock_db.User.push({
      _id: mock_db.User.length;
      username: username,
      password: password
    });

    // TODO_3: Authorize user by setting a 'guid' cookie to their _id
    // TODO_3: redirect to profile

  }

  res.redirect("/signup");
});


/*
 * Server
 */

app.listen(3000, function(){
  console.log("Server running on localhost:3000");
});
