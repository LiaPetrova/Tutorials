const courseController = require('express').Router();

const { createCourse, getById, deleteById, editCourse, enrollUser } = require('../services/courseService');
const { parseError } = require('../util/parser');
const preload = require('../middlewares/preload');
const { isOwner } = require('../middlewares/guards');

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

courseController.get('/:id/details', preload(true), async (req, res) => {
    const course = res.locals.course;

    course.isOwner = course.owner == req.user._id;
    course.isEnrolled = course.usersEnrolled.some(x => x.toString() == req.user._id.toString());

    res.render('details', {
        title: course.title,
        course
    });
});

courseController.get('/:id/edit', preload(true), isOwner(), async (req, res) => {
    const course = res.locals.course;

        // if (course.owner.toString() != req.user._id.toString()) {
        //     return res.redirect('/course/create');
        // }
    res.render('edit', {
        title: 'Edit course',
        course
    });
});

courseController.post('/:id/edit', preload(), isOwner(), async (req, res) => {

    let course = res.locals.course;

    // if (course.owner.toString() != req.user._id.toString()) {
    //     return res.redirect('/');
    // }
    
    // course = {
    //     title: req.body.title,
    //     description: req.body.description,
    //     imageUrl: req.body.imageUrl,
    //     duration: req.body.duration
    // };

    try {
        await editCourse(course, req.body);
        res.redirect(`/course/${req.params.id}/details`);

    } catch(error) {
        req.body._id = course._id;
        res.render('edit', {
            title: 'Edit Course',
            course: req.body,   
            errors: parseError(error)
        });
    }
});


courseController.get('/:id/delete', preload(), isOwner(), async (req, res) => {
    // let course = res.locals.course;
    
    // if (course.owner.toString() != req.user._id.toString()) {
    //     return res.redirect('/');
    // }
    
    await deleteById(req.params._id);
    res.redirect('/');
});

courseController.get('/:id/enroll', preload(), async (req, res) => {

    let course = res.locals.course;

    try {
        if (course.owner.toString() == req.user._id.toString()) {
            course.isOwner = true;
            throw new Error('You cannot enroll for your own course')
        }
        if (course.usersEnrolled.some(x => x.toString() == req.user._id.toString())) {
            course.isEnrolled = true;
            throw new Error('You are already enrolled for this course')
        }

    await enrollUser(course, req.user._id);
    res.redirect(`/course/${course._id}/details`);

    } catch (error) {
        course = await getById(req.params.id);
        res.render('details', {
            course,
            errors: parseError(error),
            title: 'Course details'
        });
    }

});

module.exports = {
    courseController
}

