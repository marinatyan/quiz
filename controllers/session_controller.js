var userController = require('./user_controller');
var url = require('url');
var models = require('../models');
var Sequelize = require('sequelize');


var authenticate = function(login, password){
    return models.User.findOne({where: {username: login}})
    .then(function(user){
          if (user && user.verifyPassword(password)){
        return user;
    } else {
        return null;
    }
          });
};

// Middleware: Se requiere hacer login.
exports.loginRequired = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/session?redir=' + (req.param('redir') || req.url));
    }
};


// GET /session   -- Formulario de login
exports.new = function(req, res, next) {
    var redir = req.query.redir || url.parse(req.headers.referer || "/").pathname;
    if (redir === '/session' || redir === '/users/new') {redir = "/"; }
    res.render('session/new', { redir: req.query.redir || '/' });
};


// POST /session   -- Crear la sesion si usuario se autentica
exports.create = function(req, res, next) {
    var redir = req.body.redir || '/'
    var login     = req.body.login;
    var password  = req.body.password;

    authenticate(login, password).then(function(user) {
          if(user){
	        req.session.user = {id:user.id, username:user.username, isAdmin:user.isAdmin};
             res.redirect(redir); // redirección a redir
          } else {
              req.flash('error', 'La autenticación ha fallado. Reinténtelo otra vez.');
              res.redirect("/session?redir="+redir);
          }
		})
		.catch(function(error) {
            req.flash('error', 'Se ha producido un error: ' + error);
            next(error);    
    });
};


// DELETE /session   -- Destruir sesion 
exports.destroy = function(req, res, next) {

    delete req.session.user;
    
    res.redirect("/session"); // redirect a login
};

exports.autologout = function(req, res, next){
    if (req.session.user && ((req.session.user.tf - req.session.user.ti) > 120000)) {
        req.flash('error', "Ha expirado la sesión");
        res.redirect("/session"); 
}
};