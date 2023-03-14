if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const PORT = process.env.PORT || 3000;



// Importing Libraies that we installed using npm
const express = require("express")
const app = express()
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const bodyparser = require('body-parser')
const {connectToDb, getDb } = require('./db')
const multer = require('multer')
const fs = require('fs')
const MongoStore = require('connect-mongo');
const { ObjectId } = require('mongodb')
const path = require('path')
let db
connectToDb((err)=>{
    if(!err){
        db = getDb();
        console.log('connected to database')
        app.listen(3000)
    }else{
        console.log(err)
    }
})

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

let users = []

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/E-LIBRARY',
      })
}))
app.use(passport.initialize()) 
app.use(passport.session())
app.use(methodOverride("_method"))
app.use(express.static('static'))
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.set('view engine', 'ejs')

// Configuring the register post functionality
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

let postId

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        postId = Date.now()
        cb(null, file.fieldname + '-' + postId)
    }
})

const upload = multer({storage: storage}) 



app.post('/uploadbook',checkAuthenticated, upload.fields([
    { name: 'cover', maxCount: 1},
    {name: 'book', maxCount: 1}
]), (req, res)=>{
    // console.log(req.files.pic[0].filename)
    if(req.user.admin == true){
        const bookData = {
            id: postId,
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            categories: req.body.categories,
            bookcover: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.cover[0].filename)),
                contentType: 'image/png'
            },
            bookfile: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.book[0].filename))
            },
            updateId: postId
        }
        // console.log(bookData)
        db.collection('books').insertOne(bookData).then(()=>{
            console.log('book' + '' + bookData.id + '' + 'successfully added to library')
            res.redirect('/admin')
        }).catch((err)=>{
            console.log(err)
        })
    }
})

app.post('/editbooks/:id', checkAuthenticated, upload.fields([
    { name: 'cover', maxCount: 1},
    {name: 'book', maxCount: 1}
]), (req, res)=>{
        let bookUpdate = []
        db.collection('books').find().forEach(element => {
            bookUpdate.push(element)
            // console.log(bookUpdate)
        }).then(()=>{
            bookUpdate = bookUpdate.filter((el)=>{
                return el.id == req.params.id 
            })
            // res.send(bookUpdate)
            let bookpic
            let bookpages
            let changeId
            if(req.files.cover == null){
                // res.send('NOTHING')
                bookpic = bookUpdate[0].bookcover
                // res.send(bookpic)
            }else{
                // res.send('SOMETHING')
                bookpic =  {
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.cover[0].filename)),
                    contentType: 'image/png'
                }
                // res.send(bookpic)
            }
            if(req.files.book == null){
                // res.send('NOTHING')
                bookpages = bookUpdate[0].bookfile
                changeId =  bookUpdate[0].updateId
                // res.send(bookpic)
            }else{
                // res.send('SOMETHING')
                bookpages =  {
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.book[0].filename))
                }
                changeId = postId
                // res.send(bookpic)
            }
            // res.send(bookpages)
            const pureId = Number(req.params.id)
            const updates = {
                id: pureId,
                updateId: Number(changeId),
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                categories: req.body.categories,
                bookcover: bookpic,
                bookfile: bookpages
            }
            db.collection('books').updateOne({id: pureId}, {$set: updates}).then(()=>{
                console.log('updated')
            }).then(()=>{
                res.redirect('/admin')
            })
            // console.log(changeId)
        })
        

        // console.log(req.files.cover)
})


// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // users.push({
        //     id: Date.now().toString(), 
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: hashedPassword,
        // })
        const userCred = {
            id: Date.now().toString(), 
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            admin: false
        }
        db.collection('accounts').insertOne(userCred).then(()=>{
            console.log('inserted')
        })
        db.collection('accounts').find().forEach(element => {
            users.push(element)
            // console.log(users);
        });
        // console.log(users); // Display newly registered in the console
        res.redirect("/login")
        
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})

// Routes
app.get('/', checkAuthenticated, (req, res) => {
    console.log(req.sessionID)
   let booksArray = []
    db.collection('books').find().forEach(element =>{   
        booksArray.push(element)
    }).then(()=>{
        res.render("home.ejs", {name: req.user.name, email: req.user.email, admin: req.user.admin, allbooks: booksArray})
    })
})

app.get('/readbook/:id', checkAuthenticated, (req, res)=>{
    let singleBook =[]
    let readlistArray = []
    let favsArray = []
    db.collection('books').find().forEach((element)=>{
        singleBook.push(element)
    }).then(()=>{
        // console.log(singleBook)
        singleBook = singleBook.filter(function(el){
            return el.id == req.params.id;
        })
        // console.log(singleBook)
        res.render('readbook.ejs', {books: singleBook, categories: singleBook[0].categories, bookname: singleBook[0].title,
             username: req.user.name, useremail: req.user.email, admin: req.user.admin, userid: req.user.id})
        // console.log(singleBook[0].categories)
    }).catch((err)=>{
        console.log(err)
        res.render('error.ejs')
    })
})

app.post('/favouriteadd', checkAuthenticated, (req, res)=>{
    let bookFind2 = []
    db.collection('books').find().forEach((element)=>{
        bookFind2.push(element)
    }).then(()=>{
        bookFind2 = bookFind2.filter(function(el){
            return el.id == req.body.bookid 
        })
        // console.log(bookFind2[0].bookcover)
        const data = {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
            bookid: req.body.bookid,
            userid: req.body.userid,
            bookcover: bookFind2[0].bookcover
        }
        // console.log(data)
        db.collection('favourites').insertOne(data).then(()=>{
            console.log('Added to Favourites')
        }).catch((err)=>{
            console.log(err)
        })
    })
    
})


app.post('/readlistadd', checkAuthenticated, (req, res)=>{
    let bookFind2 = []
    db.collection('books').find().forEach((element)=>{
        bookFind2.push(element)
    }).then(()=>{
        bookFind2 = bookFind2.filter(function(el){
            return el.id == req.body.bookid 
        })
        // console.log(bookFind2[0].bookcover)
        const data = {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
            bookid: req.body.bookid,
            userid: req.body.userid,
            bookcover: bookFind2[0].bookcover
        }
        // console.log(data)
        db.collection('readlist').insertOne(data).then(()=>{
            console.log('Added to Readlist')
        }).catch((err)=>{
            console.log(err)
        })
    })
    
})

let searchResult
let searchvalue
app.post('/search', checkAuthenticated, (req, res)=>{
     searchResult = []
     db.collection('books').find().forEach(element =>{
        const searchname = req.body.value
        const searchbookname = element.title
        const searchbookauthor = element.author
        const searchvalues = searchname.toLowerCase()

        if(searchbookname.includes(searchvalues) ||  searchbookauthor.includes(searchvalues) ){
           searchResult.push(element)
        //    console.log(searchResult)
        }else{
            // return false;
        }
     }).then(()=>{
        // console.log(searchResult)
        searchResult = searchResult;
        searchvalue = req.body.value
     })
    res.redirect('/results')
})

app.get('/results', checkAuthenticated, (req, res)=>{
    // res.send(searchResult)
    // console.log(searchvalue)
    res.render("search.ejs", {name: req.user.name, email: req.user.email, admin: req.user.admin, allbooks: searchResult, value: searchvalue})
 })




app.get('/openbook/:id', checkAuthenticated, (req, res)=>{
    res.setHeader('Content-Type', 'application/pdf')
    res.sendFile(__dirname + '/uploads/book-' + req.params.id)
    // console.log(__dirname + '/uploads/book-' + req.params.id)
})


app.get('/myreadlist', checkAuthenticated, (req, res)=>{
    let readlists = []
    db.collection('readlist').find().forEach(element =>{
        readlists.push(element)
    }).then(()=>{
        readlists = readlists.filter(function(el){
            return el.userid == req.user.id
        })
        // console.log(readlists)
        res.render("myreadlist.ejs", {name: req.user.name, email: req.user.email, admin: req.user.admin,
             userid: req.user.id, lists: readlists})
    })
   
})

app.get('/myfavourites', checkAuthenticated, (req, res)=>{
    let favourites = []
    db.collection('favourites').find().forEach(element =>{
        favourites.push(element)
    }).then(()=>{
        favourites = favourites.filter(function(el){
            return el.userid == req.user.id
        })
        // console.log(readlists)
        res.render("myfavourites.ejs", {name: req.user.name, email: req.user.email, admin: req.user.admin,
             userid: req.user.id, lists: favourites})
    })
   
})



app.get('/login', checkNotAuthenticated, (req, res) => {
    db.collection('accounts').find().forEach(element => {
        users.push(element)
        // console.log(users);
    }).then(()=>{
        res.render("login.ejs")
    }).catch((err)=>{
        console.log(err)
    });
   
    // res.render("login.ejs")
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    // res.render("register.ejs")
    let authUsers = []
    db.collection('accounts').find().forEach(element => {
        users.push(element)
        authUsers.push(element.email)
    }).then(()=>{
        console.log(authUsers);
        res.render("signin.ejs", {userArray: authUsers})
    })
   
})

app.get('/admin',  checkAuthenticated, (req, res)=>{
    if(req.user.admin == true){
        res.render('admin.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})
    }else{
        res.render('notadmin.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})
    }
    
})

app.get('/admin/addbook', checkAuthenticated, (req, res)=>{
    if(req.user.admin == true){
        res.render('addbook.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})
    }else{
        res.render('notadmin.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})
    }
})

app.get('/admin/allbooks', checkAuthenticated, (req, res)=>{
    if(req.user.admin == true){
        let booksArray = []
        db.collection('books').find().forEach(element =>{   
            booksArray.push(element)
        }).then(()=>{
            res.render("allbooks.ejs", {name: req.user.name, email: req.user.email, admin: req.user.admin, allbooks: booksArray})
        })
    }else{
        res.render('notadmin.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})
    }
})

app.get('/admin/editbook/:id', checkAuthenticated, (req, res)=>{
    if(req.user.admin == true){
        let singleBook =[]
    db.collection('books').find().forEach((element)=>{
        singleBook.push(element)
    }).then(()=>{
        // console.log(singleBook)
        singleBook = singleBook.filter(function(el){
            return el.id == req.params.id;
        })
        // console.log(singleBook)
        res.render('editbook.ejs', {books: singleBook, categories: singleBook[0].categories, bookname: singleBook[0].title,
             username: req.user.name, useremail: req.user.email, admin: req.user.admin, userid: req.user.id})
        // console.log(singleBook[0].categories)
    }).catch((err)=>{
        console.log(err)
        res.render('error.ejs')
    })
    }else{
        res.render('notadmin.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})

    }
})

app.get('/admin/allusers', checkAuthenticated, (req, res)=>{
    if(req.user.admin == true){
        let allusers = []
        db.collection('accounts').find().forEach(element =>{
            allusers.push(element)
        }).then(()=>{
            // console.log(allusers)
            res.render('allusers.ejs', {users: allusers})
        })
    }else{
        res.render('notadmin.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})
    }
})



// app.delete('/deleteaccount', checkAuthenticated, (req, res)=>{
//     const userid = req.user.id;
//     db.collection('accounts').deleteOne({id: req.user.id}).then(()=>{
//         console.log('account deleted')
//         res.redirect('/login')
//     }).catch((err)=>{
//         console.log(err)
//     })
// })

// End Routes

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
//   })

app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        console.log('looged out')
        db.collection('sessions').deleteOne({_id: req.sessionID}).then(()=>{
            console.log('user session deleted')
        }).then(()=>{
            
        })
        req.session.destroy((err)=>{
            if(err){
                console.log(err)
            }else{
                if (err) return next(err)
                 res.redirect("/")
            }
        })        
    })
})

app.delete('/deletereaditem/:id', checkAuthenticated, (req, res)=>{
    console.log(req.params.id)
    const readId = Number(req.params.id)
    db.collection('readlist').deleteOne({id: readId}).then((result)=>{
        // console.log('removed from readlist' + req.params.id)
        res.status(200).json('result')
    }).catch((err)=>{
        console.log(err)
    })
})

app.delete('/deletefavourite/:id', checkAuthenticated, (req, res)=>{
    console.log(req.params.id)
    const readId = Number(req.params.id)
    db.collection('favourites').deleteOne({id: readId}).then((result)=>{
        // console.log('removed from readlist' + req.params.id)
        res.status(200).json('result')
    }).catch((err)=>{
        console.log(err)
    })
})

app.delete('/deletebook/:id', checkAuthenticated, (req, res)=>{
    const bookid = Number(req.params.id)
    console.log(bookid)
    if(req.user.admin == true){
        db.collection('books').deleteOne({id: bookid}).then(()=>{
            console.log(bookid + 'deleted')
        }).catch((err)=>{
            console.log(err)
        })
    }else{
        res.render('notadmin.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})
    }
})

app.delete('/deleteuser/:id', checkAuthenticated, (req, res)=>{
    if(req.user.admin == true){
        const userid = req.params.id
        db.collection('accounts').deleteOne({id: userid}).then(()=>{
            console.log('user' + userid + 'deleted')
        })
    }else{
        res.render('notadmin.ejs', {name: req.user.name, email: req.user.email, admin: req.user.admin})
    }
})


function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    console.log('not out')
    console.log(req.sessionID)

    if(req.isAuthenticated()){
        return res.redirect("/")
    }else{
        db.collection('sessions').deleteOne({_id: req.sessionID}).then(()=>{
            console.log('user session deleted')
        }).then(()=>{
            
        })
        next()
    }
    

}

