const express = require('express');
const eh = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const db = require('./config/database');
require('./config/passport')(passport);
// Load models
const app = express();
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
	secret: 'sec',
	resave: true,
	saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});
//Connect to moongoose
mongoose.connect(db.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('MongoDB Connected')
	})
	.catch((err) => {
		console.log(err)
	});
//Use BodyParser
app.use(express.urlencoded({
	extended: false
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//Handlebars
app.engine('handlebars', eh({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
// route
const jots = require('./router/jots');
const user = require('./router/user');
app.use('/jots', jots);
app.use('/user', user);
app.get('/about', (req, res) => {
	res.render('about');
});
app.get('/', (req, res) => {
	res.render('index');
});
app.get('*', (req, res) => {
	res.status(404).send('Not Found');
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server running at port http://localhost:${port}`);
});
