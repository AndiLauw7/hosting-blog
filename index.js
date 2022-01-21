const { response, query } = require('express')
const express = require('express')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')


const app = express()
const PORT = process.env.PORT || 5000

// untuk koneksi database
const db = require('./connection/db')
const upload = require('./middlewares/fileUploads')
app.set('view engine', 'hbs')

app.use('/public', express.static(__dirname + '/public')) // path agar css dan gambar tampil
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(express.urlencoded({ extended: false }))

app.use(flash())
app.use(
    session({
        cookie: {
            maxAge: 2 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)




// let isLogin = true
// app.get('/index', function(request, response) {
//     response.render('index', {

//         isLogin: request.session.isLogin,
//         user: request.session.user
//     })
// })

app.get('/index', function(request, response) {
    db.connect(function(err, client, done) {
        if (err) throw err
        client.query('SELECT * FROM tb_carir', function(err, result) {
            let data = result.rows

            response.render('index', {
                data: data

            })


        })

    })

})


// BLOG
app.get('/blog', function(request, response) {
    db.connect(function(err, client, done) {
        const query = `SELECT tb_blog.id,tb_blog.author_id,tb_user.name AS author, tb_blog.title,
        tb_blog.image, tb_blog.content, tb_blog.post_date
            FROM tb_blog INNER JOIN tb_user ON tb_blog.author_id=tb_user.id`
        if (err) throw err
        client.query(query, function(err, result) {
            if (err) throw err
            console.log(result.rows);
            let blog = result.rows

            blog = blog.map(function(data) {
                return {
                    ...data,
                    isLogin: request.session.isLogin,
                    post_date: getFullTime(data.post_date),
                    distance: getDistance(data.post_date)
                }

            })
            response.render('blog', {
                isLogin: request.session.isLogin,
                user: request.session.user,
                blogs: blog
            })

        })
    })
})

// BLOG DETAIL
app.get('/blog-detail/:id', function(request, response) {
        // console.log(request.params)
        let id = request.params.id
        db.connect(function(err, client, done) {
            if (err) throw err
            client.query(`select * from tb_blog where id = ${id}`, function(err, result) {
                if (err) throw err
                let data = result.rows[0]
                console.log(data);
                response.render('blog-detail', { blog: data })
            })

        })

    })
    //method get contact
app.get('/contact', function(request, response) {
    response.render('contact')
})

//method-add get
app.get('/add-blog', function(request, response) {

    // console.log(request, session.isLogin)
    if (!request.session.isLogin) {
        request.flash('danger', 'Anda belum login!!!')
        response.redirect('/login')
    }

    response.render('add-blog', {
        isLogin: request.session.isLogin,
        user: request.session.user

    })
})

// method post add blog
app.post('/blog', upload.single('inputImage'), function(request, response) {

    let data = request.body

    const authorid = request.session.user.id

    const image = request.file.filename

    let query = `INSERT INTO tb_blog(title,content,image,author_id)
     VALUES ('${data.inputTitle}','${data.inputContent}','${image}', '${authorid}')`
    db.connect(function(err, client, done) {
        if (err) throw err
        client.query(query, function(err, result) {
            if (err) throw err
            response.redirect('/blog')
        })
    })
})

// METHOD EDIT POST 
app.post('/edit-blog/:id', function(request, response) {

    let id = request.params.id
    let data = request.body

    db.connect(function(err, client, done) {
        if (err) throw err
        client.query(`UPDATE tb_blog SET 
        title ='${data.inputTitle}',
        content='${data.inputContent}',image='andi.png'
         WHERE id=${id}`, function(err, result) {
            if (err) throw err
            console.log(result.rows)
            response.redirect('/blog')
        })
    })
})


// METHOD EDIT GET
app.get('/edit-blog/:id', function(request, response) {
    let id = request.params.id

    let query = `SELECT title,content FROM tb_blog WHERE 
    id = ${id}`

    db.connect(function(err, client, done) {
        if (err) throw err
        client.query(query, function(err, result) {
            if (err) throw err
            let data = result.rows
            console.log(data)
            let title = result.rows[0].title
            let content = result.rows[0].content
                // console.log(request, session.isLogin)
            if (!request.session.isLogin) {
                request.flash('danger', 'Anda belum login!!!')
                response.redirect('/login')
            }
            response.render('edit-blog', { id, title, content })
        })
    })
})

// METHOD DELETE
app.get('/delete-blog/:id', function(request, response) {

        let id = request.params.id;

        let query = `DELETE FROM tb_blog WHERE id = ${id}`
        if (!request.session.isLogin) {
            request.flash('danger', 'Anda belum login!!!')
            response.redirect('/login')

        }
        db.connect(function(err, client, done) {
            if (err) throw err

            client.query(query, function(err, result) {

                if (err) throw err
                response.redirect('/blog')

            })
        })

    })
    // GET FULLTIME TIME POST BLOG
function getFullTime(time) {
    let month = ['januari', 'februari', 'march', 'april', 'mei', 'june',
        'july', 'augst', 'september', 'october', 'november', 'desember'
    ]


    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()
    let hours = time.getHours()
    let minutes = time.getMinutes()

    let fulltime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
    return fulltime
}
// DISTANCE TIME POST BLOG
function getDistance(time) {
    let timePost = time
    let timeNow = new Date()
    let distance = timeNow - timePost

    let milisecond = 1000 //seribuu dallm 1 detik
    let secondsInHours = 3600 ///1 jam = 3600 detik
    let hoursInDay = 23 // 23 jam dalm sehari
    let minutes = 60
    let seconds = 60

    let distanceDay = Math.floor(distance / (milisecond * secondsInHours * hoursInDay))
    let distanceHours = Math.floor(distance / (milisecond * seconds * minutes))
    let distanceMinutes = Math.floor(distance / (milisecond * seconds))
    let distanceSeconds = Math.floor(distance / milisecond)

    if (distanceDay >= 1) {

        return `${distanceDay} day ago `
    } else if (distanceHours >= 1) {
        return `${distanceHours} Hours ago`
    } else if (distanceMinutes >= 1) {
        return `${distanceMinutes} Minutes ago`
    } else {
        return `${distanceSeconds} Seconds ago`
    }
}
// METHOD REGISTER
app.get('/register', function(request, response) {
    response.render('register')
})

app.post('/register', function(request, response) {
        const { inputName, inputEmail, inputPassword } = request.body
        const hashedPassword = bcrypt.hashSync(inputPassword, 10)

        let query = `INSERT INTO tb_user (name,email,password)
            VALUES ('${inputName}','${inputEmail}','${hashedPassword}')`

        db.connect(function(err, client, done) {
            if (err) throw err

            client.query(query, function(err, result) {

                if (err) throw err

                response.redirect('/login')
            })
        })
    })
    // METHOD LOGIN
app.get('/login', function(request, response) {
    response.render('login')
})




app.post('/login', function(request, response) {

    const { inputEmail, inputPassword } = request.body

    const query = `SELECT * FROM tb_user WHERE email = '${inputEmail}'`

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function(err, result) {
            if (err) throw err

            // console.log(result.rows.length);

            if (result.rows.length == 0) {

                request.flash('danger', 'Email belum terdaftar!')

                return response.redirect('/login')
            }

            const isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password)
                // console.log(isMatch);

            if (isMatch) {

                request.session.isLogin = true
                request.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                }

                request.flash('success', 'Login success')
                response.redirect('/blog')

            } else {
                request.flash('danger', 'Password tidak cocok!')
                response.redirect('/login')
            }

        })
    })
})

app.get('/logout', function(request, response) {
    request.session.destroy()

    response.redirect('/blog')

})

app.listen(5000, function() {
    console.log(`Server has been started ${PORT}`)
})