const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient


var db
var mongodb = require('mongodb');


app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json())


MongoClient.connect('mongodb://user:12345678@localhost:27017/star-wars-quotes', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})


app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/index.html')
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.

  //var cursor = db.collection('quotes').find()
  //console.log(cursor);

  //db.collection('quotes').find().toArray(function(err, results) {
  //console.log(results)
  //})
  
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
  })

})

app.get('views/', (res, req, views, local) => {
  res.render(views, local)
})


app.get('/quotes', (req, res) => {
	res.redirect('/')
})


app.post('/quotes', (req, res) => {
  console.log(req.body)
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})



app.get('/quotes/edit/:id', (req, res) => {

	db.collection('quotes').find().toArray((err, result_list) => {
	    if (err) return console.log(err)
	
		db.collection('quotes').findOne({_id:  new mongodb.ObjectID(req.params.id) },
		(err, result) => {
		    if (err) return res.send(500, err)
		    console.log('A quote got edit ' + req.params.id)  	   
		    res.render('quote.ejs', {quote: result, quotes: result_list} )
	  
		})
	})


})


app.post('/quotes/edit/:id', (req, res) => {

 
  db.collection('quotes')
  .findOneAndUpdate({_id:  new mongodb.ObjectID(req.params.id)}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
     res.redirect('/')
  })
})



app.get('/quotes/delete/:id', (req, res) => {
	db.collection('quotes').findOneAndDelete({_id:  new mongodb.ObjectID(req.params.id) },
	(err, result) => {
	    if (err) return res.send(500, err)
	    // res.send({message: 'A quote got deleted'})
	    res.redirect('/')
	    console.log('A quote got deleted ' + req.params.id)    
	})
})




