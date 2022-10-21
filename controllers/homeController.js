//TODO replace

const { getAllByDate, getAllByEnrolled } = require('../services/courseService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    let view;
    let courses = [];
    const search = req.query.search;

    if (req.user) {
        courses = await getAllByDate(search);
        view = 'user-home'      

    } else {
        view = 'guest-home';
        courses = await getAllByEnrolled();
    }  

    res.render(view, {
        title: 'Home',
        search,
        courses
    });
});

module.exports = homeController;