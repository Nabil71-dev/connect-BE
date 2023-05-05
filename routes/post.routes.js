const express=require('express');
const routes=express.Router()
const postController=require('../controllers/postController')

routes.get('/all-posts',postController.getAllPosts);
routes.get('/top-post',postController.topReactedPost);
routes.get('/user/all-posts',postController.getUserAllPosts);
routes.get('/all-topics',postController.getAllTopics);
routes.get('/:topic',postController.getPostsSpecificTopic);

routes.get('/one/:postID',postController.getSpecificPost);
routes.post('/create',postController.createPost);
routes.put('/update/:postID',postController.updatePost);
routes.delete('/delete/:postID',postController.deletePost);
routes.get('/react/:postID',postController.postReact);
routes.post('/comment/:postID',postController.postComment);


module.exports=routes;