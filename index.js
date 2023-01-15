const express = require('express');
const app = express();
const session = require('express-session');
const connection = require('./database/connection');

const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
const usersController = require('./user/usersController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./user/User');


// View engine
app.set('view engine', 'ejs');

// Sessions
app.use(session({
    secret: 'aeroiutgysedrlfhjsrlthgaeiluy',
    cookie: { maxAge: 2629800000 }
}));

// Static files
app.use(express.static('public'));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log(err);
    });

// Routes
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.get('/session', (req, res) => {
    req.session.teste = "Brittola",
    req.session.age = 22;
    req.session.children = ['Chiquinho', 'Luna'];

    res.send('sessão iniciada!');
});

app.get('/read-session', (req, res) => {
    res.json({
        teste: req.session.teste,
        age: req.session.age,
        children: req.session.children
    });
});

app.get('/', (req, res) => {
    Article.findAll({
        include: [{ model: Category }],
        order: [['id', 'DESC']],
        limit: 4
    }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render('index', { articles, categories });
        });
    })
});

app.get('/:slug', (req, res) => {
    const slug = req.params.slug;

    Article.findOne({
        where: { slug }, include: [{ model: Category }]
    }).then((article) => {
        if (article) {
            Category.findAll().then((categories) => {
                res.render('article', { article, categories });
            });
        } else {
            res.redirect('/');
        }
    }).catch((err) => {
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug;

    Category.findOne({
        where: { slug },
        include: [{ model: Article }]
    }).then((cat) => {
        if (cat) {
            Category.findAll().then((categories) => {
                res.render('category', { articles: cat.articles, categories });
            });
        } else {
            res.redirect('/');
        }
    }).catch((err) => {
        res.redirect('/');
    });
});

// Open server
app.listen(8080, () => {
    console.log('Server running on PORT:8080');
});