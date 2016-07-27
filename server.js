// require express and other modules
var express = require("express"),
    app = express()

var path = require("path"),
    views_path = path.join(process.cwd(), "views");

// parse incoming urlencoded form data in the HTTP Body
// and populate the req.body object
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// parse incoming cookies in the HTTP Header
// and populate the req.cookies object
var cookieParser = require("cookie-parser");
app.use(cookieParser("Super Secret")); // parse cookie data

/************
 * DATABASE *
 ************/

var db = require("./models");

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
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

/*
 * API Endpoints
 */

app.post(["/login", "/api/sessions"], function createSession(req, res){
  console.log("Looks like you're trying to login!");

  var email = req.body.email;
  var password = req.body.password;
  // TODO#1: find the matching user in the database
  // TODO#1: set a cookie named "guid" in the HTTP Response Header
  //                             with the user's _id as the value
  // TODO#1: redirect to the profile page
  // TODO#5: securely authenticate users
  res.redirect("/login");

});

app.get(["/logout", "/api/sessions"], function destroySession(req, res){
  console.log("Looks like you're trying to logout!");
  // TODO#2 clear the "guid" cookie from the HTTP Response Header
  res.redirect("/");
});

app.post(["/signup", "/api/users"], function createUser(req, res){
  console.log("Looks like you're trying to signup!");

  var email = req.body.email;
  var password = req.body.password;
  // TODO#3 create a new user
  // TODO#3 set a cookie named "guid" in the HTTP Response Header
  //                            with the user's _id as the value
  // TODO#3 redirect to the profile page
  // TODO#5 create new users securely (don't just store plain-text passwords!)
  res.redirect("/signup");

});

app.get("/api/profile", function showUser(req, res){
  console.log("Looks like you're visiting the profile")
  // TODO#4 grab the value of the "guid" cookie from the HTTP Request Header
  // TODO#4 find the matching user in the database
  // TODO#4 add the user to the response JSON below
  var user = null; // change me
  res.send({
    request_headers: req.headers,
    user: user || "NOT FOUND"
  });
});


/**********
 * SERVER *
 **********/

app.listen(3000, function(){
  console.log("Server running on localhost:3000");
});
