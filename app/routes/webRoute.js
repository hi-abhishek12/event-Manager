const express = require('express');
const router =  express.Router();
const webRoutes = require('../controller/web/websiteController')
const webModel = require("../model/web/webModel")
const authRoutes = require('../controller/authController/authController')
const signUp = require('../model/auth/signup')
const upload = require('../middleware/multerConfig')
const signupModel = require('../model/auth/signup');
// const eventBooking = require('../controller/web/websiteController')


router.get('/',webRoutes.homeRoute)
router.get('/create-event',webRoutes.createEventRoute);
router.post('/create-event-submit',upload.single('img'),webModel.createEventFormSubmit)

router.get('/signup',authRoutes.authenticated,async(req, res) =>{
    const data = await signupModel.signup
    res.render('signUp',{data})
})
router.post('/signup-post',signUp.signup)

router.get('/login',authRoutes.login)

// router.get('/book:id',eventBooking.eventBook)




module.exports = router;
