var User=require('./user');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var session=require('express-session');
var path=require('path');
var jwt=require('jsonwebtoken');
var secret="Harry Potter";
var token=null;
var md5 = require('md5');
var config=require('../config');
module.exports=function (app,passport) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

    passport.serializeUser(function (user,done) {
        done(null,user)
    });

    passport.deserializeUser(function(id, done) {
        done(null,id)
    });

    passport.use(new LinkedInStrategy({
        clientID: config.LinkedinLogin["Client ID"],
        clientSecret: config.LinkedinLogin["Client Secret"],
        callbackURL: config.LinkedinLogin.CallBackUrl,

        scope: ['r_emailaddress', 'r_basicprofile'],
        status: true
    }, function(accessToken, refreshToken, profile, done) {
        User.mongoConnect(
            function (err,db) {
                var design=profile._json.headline.split("at");
                var userdata={};
                userdata.firstname=profile._json.firstName;
                userdata.lastname=profile._json.lastName;
                userdata.desi=design[0];
                userdata.picture=profile._json.pictureUrl;
                userdata.encEmail=md5(profile._json.emailAddress);
                userdata._id=profile._json.emailAddress

                db.collection("users").findOne({_id:userdata._id},function (err,itm) {
                    if(itm){
                        Object.keys(itm).forEach(function (key) {

                            if(!userdata[key] && key!="picture"){
                                userdata[key] = itm[key];
                            }
                        })
                    }
                    db.collection("users").findAndModify({
                            _id: userdata["_id"]
                        }, {}, {
                            $set:userdata
                        }, {
                            new: true,
                            upsert: true
                        },
                        function(err, ret) {
                            token=jwt.sign({firstname:userdata.firstname,lastname:userdata.lastname,email:userdata.encEmail,password:userdata.password,picture:userdata.picture,desi:userdata.desi},secret);
                            return done(null,ret.value);
                        });
                })
            }
        )
    }));

    app.get('/auth/linkedin',
        passport.authenticate('linkedin', { state: 'SOME STATE'  }),function(req, res){});
    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {failureRedirect: '/'}),function (req,res) {
        res.redirect('/linkedin/'+token);
    });

    return passport;
};