const Course = require('../models/Course');

async function getAllByDate () {
    return await Course.find({}).sort( {createdAt: 1}).lean();
}

async function getAllByEnrolled() {
    return await Course.find({}).sort({ userCount: -1 }).limit(3).lean();
}

async function getById (id) {
    return await Course.findById(id).lean();
}

async function createCourse (course) {
    return  Course.create(course);
}



module.exports = {
    getAllByDate,
    createCourse,
    getAllByEnrolled,
    getById
}