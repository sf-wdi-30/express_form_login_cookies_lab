# Form Login Lab

In this lab you will gain familiarity with securely signing up, logging in, and logging out a user using forms, cookies, and the bcrypt encryption package. No AJAX.

#### Important Routes & API Endpoints
| Verb | Path | Description |
|:-----|:-----|:------------|
| GET | /signup | show signup form |
| GET | /login | show login form |
| GET | /login | show login form |
| POST | /login, /api/sessions | create session |
| GET\* | /logout, /api/sessions | destroy session |
| POST | /signup, /api/users | create user |
| GET | /api/profile | show user |

> \* please note that strictly speaking we should be using the HTTP `DELETE` method when destroying a session. Unforunately, forms do not support `DELETE` natively, and for our purposes it's more convenient to use `GET` since we can visit it easily in the browser. (See `method-override` middleware for more details.)

## Setup
Clone this repo. Install node packages. Run the database and a local server.
``` bash
npm install
mongod # do this in a separate terminal tab/window
node seed.js # seed the database
nodemon # or `node index.js`
```

Open your browser to `localhost:3000`.

## Challenge
### 1. Authentication
Take a good look at `index.js` and make sure you understand what's going on.

- **TODO #1**: Users can `/login` with a correct email and password. You can also verify that a cookie with a key of `guid` has been set in the HTTP Response Header.
- **TODO #2**: Users can `/logout`. You can verify that a cookie with a key of `guid` no longer exists in the Response Header.
- **TODO #3**: Visitors can `/signup`. You can verify that a new user has been added, you can see their `guid` in the Response Header.

### 2. Authorization
- **TODO #4**: The `/api/profile` endpoint should only be visible to authorized users. Make sure that if you're not logged in, you're bounced back to the homepage.
- **Bonus**: The `/api/profile` endpoint should only be visible to the user it belongs to.

### 3. Encrypted Passwords
Hold the phone! When we create a `User` aren't we just storing their `password` in plain-text! That's a Very Bad Thing ®!

**TODO #5**: Let's install the [bcrypt encryption package](https://www.npmjs.com/package/bcrypt) to hash and salt our passwords before saving them to the database. That way, even if our database is leaked, our users are still protected.

``` bash
npm install --save bcrypt
```

Require the `bcrypt` package near the top of `/models/user.js`:

``` js
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');
```

In `/models/user.js` rename the `password` field to `passwordDigest`:

```js
var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: {unique: true}
  },
  passwordDigest: { // required by bcrypt
    type: String,
    required: true
  }
});
```

> Note that your existing records still have the old plain-text `password` field.

Finally, we're going to attach some custom "static" convenience methods to our `User` class so that we can securely read/write passwords to our database without exposing them in plain-text, these will enable us to do the following:

* Signup: **`User.createSecure(email, password, cb)`**
    * create a new user in the database with an encrypted password (`passwordDigest`)
* Login: **`User.authenticate(email, password, cb)`**
    * verify that a supplied `email` and (plain-text) `password` match a record in the databse
    - **`user.checkPassword(password, cb)`**: verify that a given (plain-text) `password` matches the encrypted password for a specific user (`passwordDigest`)

``` js
// create a new user with secure (hashed) password (for signup)
UserSchema.statics.createSecure = function (email, password, cb) {
  // `_this` now references our schema
  var _this = this;
  // generate some salt
  bcrypt.genSalt(function (err, salt) {
    // hash the password with the salt
    bcrypt.hash(password, salt, function (err, hash) {
      // build the user object
      var user = {
        email: email,
        passwordDigest: hash
      };
      // create a new user in the db with hashed password and execute the callback when done
      _this.create(user, cb);
    });
  });
};

// authenticate user (for login)
UserSchema.statics.authenticate = function (email, password, cb) {
  // find user by email entered at log in
  this.findOne({email: email}, function (err, user) {
    // throw error if can't find user
    if (user === null) {
      cb("Can\'t find user with that email", null);
    // if found user, check if password is correct
    } else if (user.checkPassword(password)) {
      // the user is found & password is correct, so execute callback
      // pass no error, just the user to the callback
      cb(null, user);
    } else {
      // user found, but password incorrect
      cb("password incorrect", user)
    }
  });
};

// compare password user enters with hashed password (`passwordDigest`)
UserSchema.methods.checkPassword = function (password) {
  // run hashing algorithm (with salt) on password to compare with stored `passwordDigest`
  // `compareSync` is like `compare` but synchronous
  // returns true or false
  return bcrypt.compareSync(password, this.passwordDigest);
};
```


Launch the `node` REPL, and try the following:

**Signup** a new user.
``` js
var db = require('./models');
db.User.createSecure("alice@foo.co", "foobarbazz", function(err, user){
  console.log("success!", user);
});
```

Try to **login**:
* with the correct email and password.
* with the wrong email.
* with the wrong password.

``` js
var db = require('./models');
db.User.authenticate("alice@foo.co", "foobarbazz", function(err, user){
  if (err) {
    console.log(err);
  } else {
    console.log(user);
  }
});
```

Can you incorporate your new custom `User` methods into your login/signup routes?

### 4. Signed Cookies [Bonus]
Let's take full advantage of the `cookie-parser` middleware to sign our cookies. That way we know that they can't easily be tampered with or "spoofed" by a malicious user.

Our cookie currently looks something like this:
```
guid=55e5330c44d8a10eafbab6b0;
```

A signed cookie will look more like this:

```
guid=s%3Aj%3A%2255e5330c44d8a10eafbab6b0%22.ExXb0Iuk4fh8VR1A1dNaibORrPxHDpJSjVYunsIw%2FXw
```

Note that you can still read the original `_id`. _Signing a cookie !== encrypting a cookie._ The signature simply verifys that the message has not been tampered with. If any part of a signed cookie is modified, the server will detect that something fishy happened and reject the cookie.

Can you figure out how to sign your cookies? Check out the express docs for [Response Cookies](http://expressjs.com/api.html#res.cookie) & [Signed Request Cookies](http://expressjs.com/api.html#req.signedCookies).

- Set a cookie secret
- Sign Cookies in the HTTP Response Header (outgoing)
- Read signed cookies in the HTTP Request Header (incoming)
