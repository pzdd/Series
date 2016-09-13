var Schema = require('mongoose').Schema;
var serie = Schema({
  Nome: {type: String, required: true, index:{unique:true}},
  Qtd_temporadas: {type: String, required:true},
  Ano: {type: String},
  Autor: {type: String}
});

module.exports = db.model('series',serie);
