var express = require('express');
var router = express.Router();
var Serie = require('../models/serie');
var User = require('../models/user');

/* Aux method to authentication. */
function auth(req, res, next){
  if(!req.session.user){
    return res.redirect('/login');
  }
  return next();
};

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  Serie.find({},function(err,docs){
    console.log(docs);
    res.render('index',{'series':docs, 'query': ''});
  });
});

router.post('/search', auth, function(req,res, next){
  console.log(req.body.pesquisa);
  Serie.find({Nome: String(req.body.pesquisa)}, function(err,docs){
    console.log(docs.length);
    res.json(docs.length);

    if(err){
      //pesquisa por autor,dps ano
    }
  });
});

router.post('/loadSearch', auth, function(req, res, next){
  Serie.find({Nome: String(req.body.pesquisa)}, function(err,docs){
    console.log(docs.length);
    res.render('index',{'series':docs, 'query': req.body.pesquisa});

    if(err){
      //pesquisa por autor,dps ano
    }
  });
});

/* GET adicionar page. */
router.get('/adicionar', auth, function(req, res, next) {
  res.render('adicionar');
});

/* POST adicionar form.*/
router.post('/adicionar', auth, function(req, res, next){
  var serie = new Serie();
  serie.Nome = req.body.Serie.Nome;
  serie.Qtd_temporadas = req.body.Serie.Qtd_temporadas;
  serie.Ano = req.body.Serie.Ano;
  serie.Autor = req.body.Serie.Autor;
  serie.save(function(err){
    if(err) throw err;
    Serie.find({},function(err,docs){
      res.redirect('/');
    });
  });
});

/* GET params to remove. */
router.get('/remover/:id', auth, function(req, res, next) {
  console.log(req.params.id);
  Serie.findOneAndRemove({_id:req.params.id},function(err){

    if(err) throw err;

    Serie.find({},function(err,docs){
      res.redirect('/');
    });
  });
});

/* GET edit form. */
router.get('/editar/:id', auth, function(req, res, next){
  Serie.findOne({_id:req.params.id}, function(err,data){
    res.render('editar',{'serie':data});
  });
});

/* POST edit form. */
router.post('/editar/:id', auth, function(req, res, next){

  Serie.update({_id: req.params.id},
  { Nome: req.body.Serie.Nome,
    Qtd_temporadas: req.body.Serie.Qtd_temporadas,
    Ano: req.body.Serie.Ano,
    Autor: req.body.Serie.Autor
  }, function(err){
      Serie.find({},function(err,docs){
        res.redirect('/');
      });
  });
});

/* GET aux method to add a new user */
router.get('/adduser/:nome', function(req, res, next){
  console.log(req.params.nome);
  var user = new User({nome: req.params.nome,login: req.params.nome, senha: req.params.nome + 123});
  user.save(function(err){
    if(err) throw err;

    res.redirect('/login');
  });
});

/* GET login page. */
router.get('/login', function(req, res, next){
  res.render('login');
});

/* POST login form*/
router.post('/login',function(req, res, next){
  User.findOne({login: req.body.user.login, senha: req.body.user.senha},function(err,data){
    if (err){
      res.redirect('/login');
    }else if(data == null || data == 'undefined'){
      res.redirect('/login');
    }else{
      req.session.user = data;
      Serie.find({},function(err,docs){
          res.redirect('/');
      });
    }
  });
});

/* GET logout method. */
router.get('/logout', function(req, res, next){
  req.session.destroy(function(err){
    res.redirect('/login');
  });
});

module.exports = router;
