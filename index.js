var express = require("express"),
    app = express(),
    db = require("./models");

var path = require("path"),
    views_path = path.join(process.cwd(), "views");

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true})); // parse POSTed data
app.use(cookieParser("Super Secret")); // parse cookie data

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

/*
 * API Endpoints
 */

app.post(["/login", "/api/sessions"], function createSession(req, res){
  console.log("Looks like you're trying to login!");

  var username = req.body.username;
  var password = req.body.password;
  db.User.findOne({username: username, password: password}, function(err, user){
    if ( user ) {
      res.cookie("guid", user._id, { signed: true });
      res.redirect("/api/profile")
    } else {
      res.redirect("/login");
    }
  })

});

app.get(["/logout", "/api/sessions"], function destroySession(req, res){
  console.log("Looks like you're trying to logout!");
  res.clearCookie("guid");
  res.redirect("/");
});

app.post(["/signup", "/api/users"], function createUser(req, res){
  console.log("Looks like you're trying to signup!");

  var username = req.body.username;
  var password = req.body.password;

  db.User.create({username: username, password: password}, function(err, user){
    if ( user ) {
      res.cookie("guid", user._id, { signed: true });
      res.redirect("/api/profile")
    } else {
      res.redirect("/signup");
    }
  })

});

app.get("/api/profile", function showUser(req, res){
  console.log(req.cookies)
  var guid = req.signedCookies.guid;
  db.User.findOne({_id: guid}, function(err, user){
    res.send({
      request_headers: req.headers,
      user: user || "NOT FOUND"
    });
  })
});


/*
 * Server
 */

app.listen(3000, function(){
  console.log("Server running on localhost:3000");
});
