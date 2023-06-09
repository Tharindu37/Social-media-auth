const express=require('express');
const session=require('express-session');
const passport = require('passport');
const auth=require('./auth');

function isLoggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401);
}

const app=express();
app.use(session({secret:"cats"}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
    passport.authenticate('google',{scope:['email','profile']})
)
app.get('/google/callback',
    passport.authenticate('google',{
        successRedirect:'/protected',
        failureRedirect:'/auth/failure'
    })
)
app.get('/auth/failure',(req,res)=>{
    res.send("someting went wrong..")
})

app.get('/protected',isLoggedIn,(req,res)=>{
    res.send(`Hello ${req.user.displayName}`);
})

app.get('/logout',(req,res)=>{
    res.logout();
    res.send("Goodbye!");
})

const port=process.env.PORT || 5000;
app.listen(port,()=> console.log('listening on : 5000'))