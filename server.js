const api = require('./fetch/api')
// const UserModel = require('./models/user')
// const dbconnect = require('./config/db')
// const google = require('./models/googleSignIn')

const PORT = process.env.PORT || 5000

const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
// const mongoDbSession = require('connect-mongodb-session')(session)  //inclused the express session function and when this is called , it will store in mongodb
const path = require('path')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { stringify } = require('querystring')
const app = express()
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'frontend')))

app.use(api)

// app.use(passport.initialize())
// app.use(passport.session())
var count = 0
function countUsers () {
    count++;
    console.log(`Users visited and registered till now ${count}`)

}

// var store = new mongoDbSession({
//     uri: process.env.MONGO_URI,
//     collection: 'Sessions',


// })

app.use(session({
    secret: 'hello wtsup',
    resave: false, //creating new session for every browser
    saveUninitialized: false, //dont want to save the session
    // store: store,
    
}))


//google sign-in 

// app.use(passport.initialize());
// app.use(passport.session());

// // Serialize and deserialize user for sessions
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//  try{
//     const usr = await google.findById(id);
//     done(null,usr)
//  }
//  catch(err){
//     console.log(err)
//  }
// });

// var name

// // Set up Google Strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.clientId,
//   clientSecret: process.env.clientSecret,
//   callbackURL: '/auth/google/callback', // Change this URL to match your application's callback URL
// },
// async (accessToken, refreshToken, profile, done) => {
//     try {
//         let user = await google.findOne({ googleId: profile.id });
//         name = profile.displayName
//         if (!user) {
//           // If the user doesn't exist, create a new user
          
//           user = new google({
//             username: profile.displayName,
//             // email: profile.emails, // Save the Google email in the email field
//             googleId: profile.id,
//           });
          
//           await user.save();
//         }
    
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//   }
// ));

// // Create routes for login with Google
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     // Successful authentication, redirect to dashboard or homepage
//     req.session.isAUth = true
//     countUsers()
//     res.redirect('/dashboard');
//   });




const isAUth = (req,res,next)=>{
   if(req.session.isAUth){
    next()
   }
   else {
    res.redirect('/login')
   }
}





app.get('/',api,(req,res)=>{
    // req.session.isAuth = true //A session will be created if set true
    // console.log(req.session)
    // console.log(req.session.id)
    const {articles} = req
    res.json(articles)
    
})

var isTrue = false

app.get('/register',(req,res)=>{
    if(isTrue){
        return res.render('register',{message: 'user already exists'})
    }
    res.render('register',{message: ''})
})

app.post('/register',async (req,res)=>{
    const {username , email , password } = req.body
    let user = await UserModel.findOne({email})
    
    if(user) {
       isTrue = true
       return res.redirect('/register')
    }
   var hashPass = await bcrypt.hash(password , 10)

    user = new UserModel({
        username,
        email,
        password: hashPass
    })
    await user.save()
    countUsers()
    res.redirect('/login')
     count += await UserModel.find().count()
    
})




app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',async(req,res)=>{
    const {email , password} = req.body
    const user = await UserModel.findOne({email})  //.find() doesnot work , it will fetch all the object but unable to read user.password 
  
    if(!user){
        return res.redirect('/login')
    }
   

    var isTrue = await bcrypt.compare(password ,user.password )
    if(!isTrue) {
       return res.redirect('/login')
    }
    req.session.isAUth = true
    // req.session.isAUth.maxAge = 1000;
    req.session.username = user.username;
    var usr = stringify(user)
    
    
    res.redirect('/dashboard')
})



// app.get('/news',(req,res)=>{
//     var articles = req.articles
//     console.log(articles)
//     res.render('dashboard',{articles : articles})
// })
app.get('/news',api,(req,res)=>{
    const {articles} = req
    res.json(articles)
})




app.get('/news/:newsname',(req,res)=>{
    
    // if(id!= req.session.id){
    //     res.json(" match")
    // }
   
    var newsname = req.params.newsname
    var articlesFetched = req.articles
    articlesFetched = articlesFetched.filter(article => newsname === article.source)
    res.json(articlesFetched)


})


app.get('/dashboard',isAUth, (req,res)=>{
   
    res.render('dashboard' ,{username: name})
})

app.post('/logout', (req,res)=>{
    userid= ''
 req.session.destroy((err)=>{
    res.redirect('login')
 })


})


    app.listen(PORT,()=>{
        console.log('listening')
    })
    

