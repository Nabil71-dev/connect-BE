const express=require('express');
const routes=express.Router()
const userController=require('../controllers/userController')

routes.get('/profile',userController.getUserProfile);
routes.post('/login',userController.userLogin);
routes.post('/signup',userController.userSignup);
routes.put('/profile',userController.updateUserProfile);
routes.post('/reset-pass-req',userController.resetPassRequest);
routes.post('/set-pass',userController.resetPass);
routes.get('/refresh/token',userController.refreshToken);
routes.get('/:userID',userController.getSpecificUserProfile);

module.exports=routes;