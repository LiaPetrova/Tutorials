function parseError (error) {

    let result = [];
    if(error.name == 'ValidationError') {
        for(let e of Object.values(error.errors)) {
            result.push(e.message);
        }
    } else if (Array.isArray(error)) {
        
        error.map(x => result.push(x.msg));
    } else {
        result = error.message.split('\n');
    }
    return result;
}

module.exports = {
    parseError
};