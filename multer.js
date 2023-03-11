const express = require('express');
const app = express();
const {connectToDb, getDb } = require('./db')
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const bodyParser = require('body-parser')
const axios = require('axios');
const { application } = require('express');

let db
connectToDb((err)=>{
    if(!err){
        console.log('coonected to db')
        app.listen(3000)
        db = getDb()
    }else{
        console.log(err)
    }
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res)=>{
    // let books = []
    // db.collection('multerTesting').find().forEach(element => {
    //     books.push(element)
    // }).then(()=>{
    //     res.render('multertest.ejs', {books: books})
    // });

    res.setHeader('Content-Type', 'application/pdf')
    res.sendFile(__dirname + '/uploads/book-1677435206552')


})
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({storage: storage}) 


app.post('/up', upload.fields([
    { name: 'pic', maxCount: 1},
    {name: 'book', maxCount: 1}
]), (req, res)=>{
    console.log(req.files.pic[0].filename)
    const obj = {
        name: req.body.name,
        image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.pic[0].filename)),
            contentType: 'image/png'
        },
        book: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' +req.files.book[0].filename))
        }
    }

    db.collection('multerTesting').insertOne(obj).then(()=>{
        console.log('success')
    })
})