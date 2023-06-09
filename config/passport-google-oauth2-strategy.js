const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {User} = require("../models/user");
const crypto = require('crypto');
require('dotenv').config();
//USING PASSPORT GOOGLE OAUTH-2.0
passport.use(new GoogleStrategy({
    clientID: "860525280581-hlnfr13h2gpfq6vosm5hs845c1ah37eo.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "http://localhost:8000/auth/google/callback",
    passReqToCallback : true 
  },
  function(req, accessToken, refreshToken, profile, done){
    // return done(null, profile);
    console.log(profile.displayName);
    User.findOne({username:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log("error in google strategy passport",err);
            return;
        }
        // console.log(profile);

        if(user){
            return done(null, profile);
        }
        else{
            User.create({
                displayName: profile.displayName,
                username: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            },function(err,user){

                if(err){
                    console.log("error in creating user google strategy passport",err);
                    return;
                }
                return done(null, profile);
            })
        }
    })
}));

passport.serializeUser((user,done)=>{
    done(null,user);
})
passport.deserializeUser(async (user, done) => {
    done(null, user);
    
});
 