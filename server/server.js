/*
	Structure of Document
		Setup
		Config	
		BASE routes
			middleware
			routes
		API routes
			middleware
			routes
	
	Integrating Firebase into web app
*/



// BASE SETUP ================================================================
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	//morgan = require('morgan'),
	firebase = require("firebase");

var port = process.env.PORT || 6969; 
var config = {
    apiKey: "AIzaSyA8W6_vAipwnCAtRIZOdNmmwY3FYg5RmQY",
    authDomain: "postit-app-81223.firebaseapp.com",
    databaseURL: "https://postit-app-81223.firebaseio.com",
    projectId: "postit-app-81223",
    storageBucket: "postit-app-81223.appspot.com",
    messagingSenderId: "954139347961"
  };

// firebase setup
firebase.initializeApp(config);
var db = firebase.database();
var usersRef = db.ref("users");
var groupRef = db.ref("/group");



// CONFIGURE APP

// body parser, to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// configure app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POSTS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, \
		content-type, Authorization');
	next();
});


// BASE APP ==================================================================
// MIDDLEWARE 
//app.use(morgan('dev'));  // log all requests to the console

// BASE ROUTES 
app.get('/', function(req, res) {
	res.send('welcome to the home page!');
});



// API =======================================================================
var apiRouter = express.Router();  // get an express router

// API MIDDLEWARE ============================================================
apiRouter.use(function(req, res, next) {
	console.log("someone just came to the app");
	// this is where we authenticate users
	next();
});

// API Routes =================================================================
apiRouter.get('/', function(req, res) {
	res.json({ message: 'woah check out this json'});
});

apiRouter.route('/user/signup') 
     //create a user
	.post(function(req, res) {
		// Firebase
		let email = req.body.email
		let password = req.body.password
		firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
        usersRef.push({
	        first_name: req.body.firstname,
			last_name: req.body.lastname,
			e_mail: req.body.email,
			pass_word: req.body.password
		})
		res.send('user has been added');
    }).catch(function(error){
				res.json({ message: error.message});
		})

	}) 
	.get(function(req, res) {
		// Firebase get all users
		usersRef.once("value", function(snapshot, prevChildKey) {
			res.json(snapshot.val());
		})
	});

// Single User Routes
var signinRoute = express.Router();

signinRoute.route('/user/signin')

   .post(function(req, res) {
   	    let email = req.body.email;
   	    let password = req.body.password;
   	    firebase.auth().signInWithEmailAndPassword(email, password)
   	   .then(function() {
   	   	res.send('successfully login');

   	   })
   	   .catch((error) =>{
   	   	res.json({ message: 'unsuccessfully login'});
   	   })
   	});

   // var creategroupRoute = express.Router();

   // creategroupRoute.route()
    
   app.post('/group', function(req, res){
   	     let groupname = req.body.groupname;
   	     let groupdescription = req.body.groupdescription;
   	     let groupkey =  groupRef.push({name: groupname, description: groupdescription}).key;
   	     //firebase.auth().createGroupWithEmailandPassword(email, password)

   	     let user = firebase.auth().currentUser;
   	     let uid = user.uid;
   	     res.send('correct');


   	 });

  // Add Members

  app.post('/group/:groupid/uid/user',function(req, res){
  	let groupid = req.param.groupid;
  	let uid = rq.param.uid;
  	const db = fire.database.ref()
  	const usersKey =db.ref("users")
  	db.ref().child('group/'+ groupid + '/user'+ uid).push

  })


		
	

// Register our routes - all routes prefixed with /api
//app.use('/api', apiRouter);
//app.use('/api', signinRoute);
//app.use('/api', groupRoute);


//START THE SERVER ===========================================================
app.listen(port);
console.log('port: '+ port);