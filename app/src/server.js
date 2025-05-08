const dns = require('dns')
const express = require("express")
const server = express()
const  routes = require("./routes")

var baseUrl = process.env.BASE_URL_APP
let baseUrlAuth = process.env.BASE_URL_APP
let ipMockAuth;
let port_auth = process.env.AUTH_PORT;
let port = process.env.PORT;
let NOT_USE_SSL = process.env.NOT_USE_SSL;
let clientID = process.env.clientID
let issueBaseURL = process.env.issuerBaseURL

var protocol = "https";

if (port == null || port == "") {
  port = 5000;
}

if (port_auth == null || port_auth == "") {
  port_auth = 8080;
}

if(NOT_USE_SSL === "true"){
    var protocol = "http"
    var baseUrl = `${baseUrl}:${port}`
}

const path = require("path")

// usando template engine
server.set('view engine', 'ejs')

//Mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

// habilitar arquivos statics
server.use(express.static("public"))

// usar o req.body
server.use(express.urlencoded({ extended : true }))

//uso bootstrap e jquery
//server.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')))
//server.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')))
//server.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')))

server.use('/css', express.static('node_modules/bootstrap/dist/css'))
server.use('/js', express.static('node_modules/bootstrap/dist/js'))
server.use('/js', express.static('node_modules/jquery/dist'))

// Auth
const { auth } = require('express-openid-connect');

// producao
/*const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://divinoalimento.herokuapp.com/',
  clientID: 'rgoQA3D5j8QnxDYo3Q0peiuTBq5u7nyj',
  issuerBaseURL: 'https://ancient-cell-2834.us.auth0.com'
};
*/


/*
// staging
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://divinoalimento-staging-1-1.herokuapp.com',
  clientID: 'cFKpu29uPIIIgUTDoTZ03eQbzp9EwOh0',
  issuerBaseURL: 'https://ancient-cell-2834.us.auth0.com'
};
*/

function init_server(config){
  server.use(auth(config));
  server.use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
  });
  server.use(routes)
  server.listen(port, () => console.log(
    'Voce ta Rodando Agora!!!!!'))
}

if (process.env.NODE_ENV === 'development') {

  const obtenerIpDominio = () => {
    return new Promise((resolve, reject) => {
      dns.lookup('mock-oauth2-server', (err, address) => {
	if (err) {
	  reject(err);
	} else {
	  ipMockAuth = address;
	  resolve(ipMockAuth);
	}
      });
    });
  };

  const config = {
	authRequired: false,
	auth0Logout: true,
	secret: 'a long, randomly-generated string stored in env',
	baseURL: `${protocol}://${baseUrl}`,
	clientID: 'debugger',
	issuerBaseURL: "",
	clientSecret: 'debugger',
	authorizationParams: {response_type:'code'}
  };


  if (protocol == "http"){
    obtenerIpDominio().then(() => {
      console.log(`A IP do Docker mock-oauth2-server è: ${ipMockAuth}`);
      console.log(`A Base Url è: ${baseUrl}`);
      config.issuerBaseURL = `${protocol}://${ipMockAuth}:${port_auth}/default`;
      init_server(config);
    }).catch((err) => {
      console.error(err);
    });
  } else {
    config.issuerBaseURL = `${protocol}://${process.env.BASE_URL_AUTH}`;
    init_server(config);
  }
}

if (process.env.NODE_ENV === 'production') {

  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: ${baseUrl},
    clientID: ${clientID},
    issuerBaseURL: ${issuerBaseURL}
  };

  init_server(config)

}
