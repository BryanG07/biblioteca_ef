const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const app = express();
const port = 3000;
const formParser = bodyParser.urlencoded({extended: false})

app.set('view engine', 'pug')
app.set('views', 'views')

var db
var url = "mongodb://localhost:27017/"

// Conexión a mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  if(err) throw err
  db = client.db("biblioteca_db")
  console.log("Conectado a mongodb")
})

app.get('/', function(req, res) {
  db.collection("libros").find({}).toArray(function(err, result) {
    if(err) throw err
    res.render('index.pug', {libros: result})
  })
})

//Libros
// Listar datos
app.get('/l', function(req, res) {
  db.collection("libros").find({}).toArray(function(err, result) {
    if(err) throw err
    res.render('./libros/libros.pug', {libros: result})
  })
})

// Agregar datos web
app.get('/agregar_lib', function(req, res) {
  res.render('./libros/agregar_lib.pug')
})

// Agregar datos
app.post('/agregar_lib', formParser, function(req, res) {
  db.collection("libros").insertOne(req.body, function(err, result) {
    res.send({redirectTo: '/l'})
  })
})

// Leer datos web
app.get('/mostrar/:id', function(req, res) {
  db.collection("libros").findOne({_id: new ObjectId(req.params.id)}, function(err, result) {
    if(err) throw err
    res.render('./libros/mostrar_lib.pug', {mostrar: result})
  })
})

// Actualizar datos web
app.get('/actualizar/:id', function(req, res) {
  db.collection("libros").findOne({_id: new ObjectId(req.params.id)}, function(err, result) {
    if(err) throw err
    res.render('./libros/actualizar_lib.pug', {mostrar: result})
  })
})

// Actualizar datos
app.put('/actualizar_lib', formParser, function(req, res) {
  db.collection("libros").updateOne({_id: new ObjectId(req.body._id)}, {$set: {libro: req.body.libro, autor: req.body.autor, editorial: req.body.editorial, descripcion: req.body.descripcion}}, function(err, result) {
    if(err) throw err
      res.send({redirectTo: '/l'})
  })
})

// Eliminar datos
app.delete('/eliminar_lib', formParser, function(req, res) {
  db.collection("libros").deleteOne({_id: new ObjectId(req.body.id)}, function(err, obj) {
    if(err) throw err
    res.send({redirectTo: '/l'})
  })
})


//Prestamos
// Listar datos
app.get('/p', function(req, res) {
  db.collection("prestamo").find({}).toArray(function(err, result) {
    if(err) throw err
    res.render('./prestamos/prestamos.pug', {prestamo: result})
  })
})

// Agregar datos web
app.get('/agregar_pres', function(req, res) {
  res.render('./prestamos/agregar_pres.pug')
})

// Agregar datos
app.post('/agregar_pres', formParser, function(req, res) {
  db.collection("prestamo","libros").insertOne(req.body, function(err, result) {
    res.send({redirectTo: '/p'})
  })
})

// Leer datos web
app.get('/mostrar_/:id', function(req, res) {
  db.collection("prestamo").findOne({_id: new ObjectId(req.params.id)}, function(err, result) {
    if(err) throw err
    res.render('./prestamos/mostrar_pres.pug', {mostrar: result})
  })
})

// Actualizar datos web
app.get('/actualizar_/:id', function(req, res) {
  db.collection("prestamo").findOne({_id: new ObjectId(req.params.id)}, function(err, result) {
    if(err) throw err
    res.render('./prestamos/actualizar_pres.pug', {mostrar: result})
  })
})

// Actualizar datos
app.put('/actualizar_pres', formParser, function(req, res) {
  db.collection("prestamo").updateOne({_id: new ObjectId(req.body._id)}, {$set: {nombre: req.body.nombre, apellido: req.body.apellido, documento: req.body.documento, telefono: req.body.telefono}}, function(err, result) {
    if(err) throw err
      res.send({redirectTo: '/p'})
  })
})

// Eliminar datos
app.delete('/eliminar_pres', formParser, function(req, res) {
  db.collection("prestamo").deleteOne({_id: new ObjectId(req.body.id)}, function(err, obj) {
    if(err) throw err
    res.send({redirectTo: '/p'})
  })
})

app.listen(port, () => {
  console.log(`Mi app corriendo en el puerto ${port}`);
});
