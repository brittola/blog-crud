const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then((articles) => {
        res.render('./admin/articles/index', { articles });
    });
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render('./admin/articles/new', { categories });
    });
});

router.post('/articles/save', (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const categoryId = req.body.category;
    const slug = slugify(title);

    Article.create({ title, slug, body, categoryId })
        .then(() => {
            res.redirect('/admin/articles');
        });
});

router.post('/articles/delete', (req, res) => {
    const id = req.body.id;

    if (id) {
        if (!isNaN(id)) {
            Article.destroy({
                where: { id }
            }).then(() => {
                res.redirect('/admin/articles');
            });
        } else {
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        res.redirect('/admin/articles');
    } else {
        Article.findByPk(id).then(article => {
            if (article) {
                Category.findAll().then(categories => {
                    res.render('./admin/articles/edit', { article, categories });
                });
            } else {
                res.redirect('/admin/articles');
            }
        }).catch(err => {
            res.redirect('/admin/articles');
        });
    }
});

router.post('/articles/update', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const slug = slugify(title);
    const body = req.body.body
    const categoryId = req.body.categoryId;

    Article.update({ title, slug, body, categoryId }, { where: { id } })
        .then(() => {
            res.redirect('/admin/articles');
        });
});

router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num;

    if (isNaN(parseInt(page))) {
        res.redirect('/');
    } else {
        page = parseInt(page);
        let offset = (page * 4) - 4;

        Article.findAndCountAll({
            limit: 4,
            offset,
            order: [['id', 'DESC']],
            include: [{ model: Category }]
        }).then((articles) => {
            if (articles.rows.length == 0) {
                res.redirect('/');
            } else {
                let next;
                let previous;

                if (offset + 4 >= articles.count) {
                    next = false;
                } else {
                    next = true;
                }

                if (offset - 4 < 0) {
                    previous = false;
                } else {
                    previous = true;
                }

                let result = {
                    page,
                    next,
                    previous,
                    articles
                }

                Category.findAll().then(categories => {
                    res.render('./admin/articles/page', { result, categories });
                });
            }
        });
    }
});

module.exports = router;