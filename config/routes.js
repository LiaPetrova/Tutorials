const authController = require("../controllers/authController");
const { courseController } = require("../controllers/courseController");
const homeController = require("../controllers/homeController");
const { isGuest, hasUser } = require("../middlewares/guards");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', isGuest(), authController);
    app.use('/course', hasUser(), courseController);
};