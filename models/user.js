var Schema = require('mongoose').Schema;
var user = Schema({
  nome: {type: String},
  login: {type: String},
  senha: {type: String}
});
var User = db.model('users',user);
module.exports =  User;
