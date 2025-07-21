const express = require('express');
const router =  express.Router();
const webRoutes = require('../controller/web/websiteController')
const webModel = require("../model/webModel")
const authRoutes = require('../controller/authController/authController')
const signUp = require('../model/auth/signup')
router.get('/',webRoutes.homeRoute)

router.get('/create-event',webRoutes.createEventRoute);
router.post('/create-event-submit',webModel.createEventFormSubmit)

router.get('/signup',authRoutes.signup)
router.post('/signup',signUp.signup)

router.get('/login',authRoutes.login)



module.exports = router;
