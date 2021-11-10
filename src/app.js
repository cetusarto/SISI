const express = require('express'),
  path = require('path'),
  morgan = require('morgan'),
  mysql = require('mysql'),
  myConnection = require('express-myconnection');

const app = express();
const passport = require('passport');
const cookieParser = require("cookie-parser")
const session = require("express-session")
const PassportLocal = require('passport-local').Strategy;


// importing routes
const menuRoutes = require('./routes/menu');
const categoriaRoutes = require('./routes/categoria');
const productoRuotes = require('./routes/producto');
const proveedorRuotes = require('./routes/proveedor');
const contactoRuotes = require('./routes/contacto');
const cajaRuotes = require('./routes/caja');
const tableroRoutes = require('./routes/tablero')



// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Password



// middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: '***',
  port: 3306,
  database: 'surtimax'
}, 'single'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('Mi secreto'));

app.use(session({
  secret: "Mi secreto",
  resave: true,
  saveUninitialized: true
}))

//Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(function (username, password, done) {
  if (username === 'Root123' && password === 'A123456') {
    console.log("imin")
    return done(null, { id: 1, name: "Alex" });
  }
  console.log("imin")
  done(null,false);
}));

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(user,done){
  done(null,{ id: 1, name: "Alex" });
});

//Serves all the request which includes /images in the url from Images folder
app.use('/public', express.static(__dirname + '/public'));


// routes
app.use('/', menuRoutes);
app.use('/categoria/', categoriaRoutes);
app.use('/producto/', productoRuotes);
app.use('/proveedor/', proveedorRuotes);
app.use('/contacto/', contactoRuotes);
app.use('/caja/', cajaRuotes);
app.use('/tablero/', tableroRoutes);

//login route
app.get('/login', (req, res) => {
  res.render("login")
})

app.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login"
}))



// starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
