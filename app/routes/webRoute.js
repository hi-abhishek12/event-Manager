const express = require('express');
const router =  express.Router();
const webRoutes = require('../controller/websiteController')
const webModel = require("../model/webModel")


router.get('/',webRoutes.homeRoute)

router.get('/create-event',webRoutes.createEventRoute);
router.post('/create-event-submit',webModel.createEventFormSubmit)

router.get('/signup',webRoutes.signup)
router.get('/login',webRoutes.login)



module.exports = router;
