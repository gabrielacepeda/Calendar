const express = require('express')
const app = express()
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
var moment = require('moment')

var db

MongoClient.connect('mongodb://calendar:cal123@ds261828.mlab.com:61828/calendar-app', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('appointments').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {appointments: result})
  })
})

app.post('/appointments', (req, res) => {
  db.collection('appointments').save({msg: req.body.msg}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})


app.delete('/appointments', (req, res) => {
  db.collection('appointments').findOneAndDelete({msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
