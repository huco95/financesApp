const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash'); // Required by passportjs
const session = require("express-session"); // Required by passportjs
const bodyParser = require("body-parser"); // Required by passportjs
const bcrypt = require('bcrypt');
const User = require("../../schemas/UserSchema");

module.exports = (app) => {
  
  app.use(flash()); // Connect flash, must be before passportjs
  app.use(session({ secret: "cats" }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Validate password
  const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
  }

  // Hash password
  const createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

  // SignUp local
  passport.use('signup_local', new LocalStrategy({
    passReqToCallback: true
  },
  (req, username, password, done) => {
    findOrCreateUser = () => {
      User.findOne({ username: username }, (err, user) => {
        if (err){
            console.log('Error in SignUp: ' + err);
            return done(err);
        }

        if (user) {
            console.log('User already exists');
            return done(null, false, req.flash('message','User Already Exists'));
        } else {
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);

          // save the user
          newUser.save((err) => {
            if (err){
                console.log('Error in Saving user: '+err);  
                throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };
    
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));

  // Login local
  passport.use('login_local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, done) => {
    User.findOne({ username:  username }, (err, user) => {
        if (err) {
            console.log(err);
            return done(err);
        }

        if (!user){
          console.log('User ' + username + ' Not Found');
          return done(null, false,  req.flash('error', true));                 
        }

        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, req.flash('error', true));
        }

        return done(null, user);
      }
    );
  }));
}