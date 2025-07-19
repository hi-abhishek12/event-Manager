const express = require('express');
const router =  express.Router();
const webRoutes = require('../controller/websiteController')

router.get('/',webRoutes.homeRoute)
router.get('/create-event',webRoutes.createEventRoute);
module.exports = router
