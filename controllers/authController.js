const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router();

authController.get('/register', isGuest(), (req, res) => {
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register',
body('username')
.isLength({ min: 5}).withMessage('Usename must be at least 5 characters long')
.isAlphanumeric().withMessage('Username must contain only english letters and digits'),
body('password')
.isLength({ min: 5}).withMessage('Password must be at least 5 characters long')
.isAlphanumeric().withMessage('Password must contain only english letters and digits'), 
async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if(errors.length > 0) {
            throw errors;
        }
        if(req.body.password !== req.body.rePassword) {
            throw new Error ('Passwords don\'t match');
        }
        const token = await register(req.body.username, req.body.password);

        res.cookie('token', token);
        res.redirect('/');
    } catch(error) {
        const errors = parseError(error);
        
        res.render('register', {
            title: 'Register Page',
            body: {
                username: req.body.username,
            },
            errors
        })

    }
});

authController.get('/login',isGuest(), (req, res) => {
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login',isGuest(), async (req, res) => {

    try {
        if(req.body.username == '' || req.body.password == '') {
            throw new Error ('All fields are required');
        }
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');

    }catch(error) {

        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            body: {
                username: req.body.username
            },
            errors
        }); 
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});                                                                                                                 


module.exports = authController;