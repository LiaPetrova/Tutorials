const { createCourse, getById } = require('../services/courseService');
const { parseError } = require('../util/parser');

const courseController = require('express').Router();

courseController.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Course'
    });
});

courseController.post('/create', async (req, res) => {

    const course = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration,
        owner: req.user._id
    };

    try {
        await createCourse(course);
        res.redirect('/');

    } catch (error) {
        res.render('create', {
            title: 'Create Course',
            body: course,   
            errors: parseError(error)
        });
    }
});

courseController.get('/:id/details', async (req, res) => {
    const course = await getById(req.params.id);
    const isOwner = course.owner == req.user._id;

    res.render('details', {
        title: course.title,
        course,
        isOwner
    });
});


module.exports = {
    courseController
}