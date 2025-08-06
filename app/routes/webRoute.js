const express = require('express');
const router =  express.Router();
const webRoutes = require('../controller/web/websiteController')
const authRoutes = require('../controller/authController/authController')
const signUp = require('../model/auth/signup')
const signupModel = require('../model/auth/signup');
// const booking = require('../controller/web/websiteController')

router.get('/',webRoutes.homeRoute);

router.get('/book/:event_id',webRoutes.booking );
router.get('/my-booking',webRoutes.myBookings);
router.post('/book/:event_id',webRoutes.confirmBooking);
router.post('/cancel-booking/:booking_id',webRoutes.cancelBooking);
router.get('/search',webRoutes.search)
router.get('/create-event',webRoutes.createEventRoute);

router.get('/signup',authRoutes.authenticated,async(req, res) =>{
    const data = await signupModel.signup
    res.render('signUp',{data})
})

router.post('/user/signup',signUp.signup)


router.get('/login',authRoutes.loginRender)
router.post('/user/login',authRoutes.login);


router.get('/logout',authRoutes.logout);


module.exports = router;
