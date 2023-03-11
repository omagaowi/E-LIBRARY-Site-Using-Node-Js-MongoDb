const express = require('express');
const app = express();
const {connectToDb, getDb } = require('./db')
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

connectToDb((err)=>{
    if(!err){
        console.log('coonected to db')
        app.listen(3000)
    }else{
        console.log(err)
    }
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

const upload = multer({dest: '/uploads'})

app.get('/', (req, res)=>{
    res.render('multertest.ejs')
})

app.post('/up', upload.single('avatar'), (req, res)=>{
   console.log(req.file)
   console.log(req.body.name)
})