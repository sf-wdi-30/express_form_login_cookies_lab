var express = require("express"),
    app = express();

var path = require("path"),
    views_path = path.join(process.cwd(), "views");

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
  res.send(req.cookie);
});

/*
 * API Endpoints
 */

app.post(["/signup", "/api/users"], function createUser(req, res){
  console.log("Looks like you're trying to signup!");
  // TODO: create new user
  // TODO: login new user
  // TODO: redirect to profile
  res.redirect("/signup");
});

app.post(["/login", "/api/sessions"], function createSession(req, res){
  console.log("Looks like you're trying to login!");
  // TODO: Authenticate user is who they say they are
  // TODO: set cookie
  // TODO: redirect to profile
  res.redirect("/login");
});

app.get(["/logout", "/api/sessions"], function destroySession(req, res){
  console.log("Looks like you're trying to logout!");
  // TODO: delete cookie
  res.redirect("/");
});



/*
 * Server
 */

app.listen(3000, function(){
  console.log("Server running on localhost:3000");
});
