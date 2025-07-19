const webController = require('../model/homePageModel');

async function homeRoute (req , res){
    const data = await webController.upComingEvents();
    res.render('index',{data})
}

function createEventRoute (req , res){
    res.render('createEvent')
}
module.exports = {
    homeRoute,
    createEventRoute
}