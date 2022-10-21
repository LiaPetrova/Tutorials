const Course = require('../models/Course');

async function getAllByDate (search) {
    const query = {};
    if (search) {
        query.title = new RegExp(search, 'i');
    }
    return Course.find(query).sort( {createdAt: 1}).lean();
}

async function getAllByEnrolled() {
    return Course.find({}).sort({ userCount: -1 }).limit(3).lean();
}

async function getById (id) {
    return Course.findById(id).lean();
}

async function getByIdRaw (id) {
    return Course.findById(id);

}

async function createCourse (course) {
    return Course.create(course);
}

async function editCourse (course, data) {

    course.title = data.title;
    course.description = data.description;
    course.duration = data.duration;
    course.imageUrl = data.imageUrl;

    return course.save();
}

async function deleteById (id) {
    return Course.findByIdAndDelete(id);
}

async function enrollUser (course, userId) {

    course.usersEnrolled.push(userId);
    course.userCount++;

    return course.save();

}


module.exports = {
    getAllByDate,
    createCourse,
    getAllByEnrolled,
    getById,
    getByIdRaw,
    editCourse,
    deleteById,
    enrollUser
}