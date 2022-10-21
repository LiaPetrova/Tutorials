//TODO replace

const { getAllByDate, getAllByEnrolled } = require('../services/courseService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    let view;
    let courses = [];

    if (req.user) {
        courses = await getAllByDate();
        view = 'user-home'      

    } else {
        view = 'guest-home';
        courses = await getAllByEnrolled();
    }  

    res.render(view, {
        title: 'Home',
        courses
    });
});

module.exports = homeController;