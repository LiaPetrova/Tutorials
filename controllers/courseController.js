const { createCourse, getById, deleteById, editCourse } = require('../services/courseService');
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

courseController.get('/:id/edit', async (req, res) => {
    const course = await getById(req.params.id);

    if (course.owner.toString() != req.user._id.toString()) {
        return res.redirect('/course/create');
    }
    res.render('edit', {
        title: 'Edit course',
        course
    });
});

courseController.post('/:id/edit', async (req, res) => {

    let course = await getById(req.params.id);

    if (course.owner.toString() != req.user._id.toString()) {
        return res.redirect('/');
    }
    
    course = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration
    };

    try {
        await editCourse(req.params.id, course);
        res.redirect(`/course/${req.params.id}/details`);

    } catch(error) {
        res.render('edit', {
            title: 'Edit Course',
            course: req.body,   
            errors: parseError(error)
        });
    }
});


courseController.get('/:id/delete', async (req, res) => {
    const course = await getById(req.params.id);

    if (course.owner.toString() != req.user._id.toString()) {
        return res.redirect('/');
    }

    await deleteById(course._id);
    res.redirect('/');
});


module.exports = {
    courseController
}