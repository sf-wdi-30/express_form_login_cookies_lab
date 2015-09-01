## Simple Login Lab

In this lab you will gain familiarity with the process signing up, logging in, and logging out a user.

**Important Routes & API Endpoints**
| Verb | Path | Description |
|:---|:-------|
| GET | /signup | show signup form |
| GET | /login | show login form |
| GET | /login | show login form |
| POST | /login, /api/sessions | create a new session |
| GET\* | /logout, /api/sessions | destroy the session |
| POST | /signup, /api/users | create a new user |

\* please note that strictly speaking we should be using the HTTP `DELETE` method when destroying a session. Unforunately, forms do not support `DELETE` natively, and for our purposes it's more convenient to use `GET` since we can visit it easily in the browser. See `method-override` middleware for more details.

**Setup**
Install node packages and run the local server:
``` bash
npm install
nodemon # or `node index.js`
```

Open your browser to `localhost:3000`.

#### 1. Authentication
Take a good look at `index.js` and make sure you understand what's going on.

- **TODO #1**: Users can login with a correct username and password. You can also verify that a cookie with a key of `guid` has been set in the HTTP Response Header.
- **TODO #2**: Users can logout. You can verify that a cookie with a key of `guid` no longer exists in the Response Header.
- **TODO #3**: Visitors can Signup. You can verify that a new user has been added, you can see their `guid` in the Response Header.

#### 2. Authorization
- **TODO #4** The `/profile` endpoint should only be visible to authorized users. Make sure that if you're not logged in, you're bounced back to the homepage.

#### 3. Secret Cookies
Let's take full advantage of the `cookie-parser` middleware to encrypt or "sign" our cookies. That way we know that they can't easily be tampered with by a malicious user.

Encryption is a two part process. We'll need to be able to both encrypt (write) and decrypt (read) the new cookies. Make sure to update all your endpoints!

It's time to hit the docs: [Express cookie-parser](https://github.com/expressjs/cookie-parser).

#### 4. Mongo Integration (Stretch)
- Now it's time to wire up our database. Create a User schema, require the User model in the Express app, and update all routes to use the new database.

And don't forget to install `mongoose`!

``` bash
npm install --save mongoose
```
 
