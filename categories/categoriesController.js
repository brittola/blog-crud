const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('./admin/categories/new');
});

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render('./admin/categories/index', { categories });
    });
});

router.post('/categories/save', (req, res) => {
    const title = req.body.title;

    if (title) {
        const slug = slugify(title);

        Category.create({
            title,
            slug
        }).then(() => {
            res.redirect('/admin/categories');
        });
    } else {
        res.redirect('/admin/categories/new');
    }
});

router.post('/categories/delete', (req, res) => {
    const id = req.body.id;

    if (id) {
        if (!isNaN(id)) {
            Category.destroy({
                where: { id }
            }).then(() => {
                res.redirect('/admin/categories');
            });
        } else {
            res.redirect('/admin/categories');
        }
    } else {
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        res.redirect('/admin/categories');
    } else {
        Category.findByPk(id).then(cat => {
            if (cat) {
                res.render('./admin/categories/edit', { cat });
            } else {
                res.redirect('/admin/categories');
            }
        }).catch(err => {
            res.redirect('/admin/categories');
        });
    }
});

router.post('/categories/update', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const slug = slugify(title);

    Category.update({ title, slug }, { where: { id } })
        .then(() => {
            res.redirect('/admin/categories');
        });
});

module.exports = router;