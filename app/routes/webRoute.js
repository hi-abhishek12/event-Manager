const express = require('express');
const router =  express.Router();
const webRoutes = require('../controller/web/websiteController')
const webModel = require("../model/webModel")
const authRoutes = require('../controller/authController/authController')
const signUp = require('../model/auth/signup')
const upload = require('../middleware/multerConfig')

router.get('/',webRoutes.homeRoute)

router.get('/create-event',webRoutes.createEventRoute);
router.post('/create-event-submit',upload.single('img'),webModel.createEventFormSubmit)

router.get('/signup',authRoutes.signup)
router.post('/signup',signUp.signup)

router.get('/login',authRoutes.login)



module.exports = router;
