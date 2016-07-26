# Form Login Lab

In this lab you will gain familiarity with signing up, logging in, and logging out a user using forms & cookies. No AJAX.

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

## Challenge
#### Setup
Clone this repo. Install node packages. Run the database and a local server.
``` bash
npm install
node seed.js # seed the database
mongod # do this in a separate terminal tab/window
nodemon # or `node index.js`
```

Open your browser to `localhost:3000`.

#### 1. Authentication
Take a good look at `index.js` and make sure you understand what's going on.

- **TODO #1**: Users can `/login` with a correct username and password. You can also verify that a cookie with a key of `guid` has been set in the HTTP Response Header.
- **TODO #2**: Users can `/logout`. You can verify that a cookie with a key of `guid` no longer exists in the Response Header.
- **TODO #3**: Visitors can `/signup`. You can verify that a new user has been added, you can see their `guid` in the Response Header.

#### 2. Authorization
- **TODO #4**: The `/api/profile` endpoint should only be visible to authorized users. Make sure that if you're not logged in, you're bounced back to the homepage.
- **Bonus**: The `/api/profile` endpoint should only be visible to the user it belongs to.

#### 3. Signed Cookies
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

#### 4. User Methods
Let's clean up our code a bit by refactoring our authentication logic into a User class method. Add the following to `models/user.js` and then incorporate it into the `/login` route:

``` javascript
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
```

We can call this method on the `User` class as follows:

```
User.authenticate("anon", "123", function(err, user){
    console.log("Succesfully authenticated", user.username);
})
```
