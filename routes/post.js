const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, updatePost, getPostList, deletePost, getPost} = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

router.get('/detail/:id', isLoggedIn, getPost);

// CREATE
router.post('/create', isLoggedIn, uploadPost);

// UPDATE
router.put('/update/:id',isLoggedIn ,updatePost)

// READ
// 상세페이지
router.get('/detail/:id', isLoggedIn, getPost);

// 전체 글 목록
router.get('/lists', getPostList);

// DELETE
// /posts/delete
router.delete('/:id', deletePost, isLoggedIn, (req, res) => {
	res.render('postList');
});

router.get('/write', isLoggedIn, (req, res) => {
	res.render('write');
});

router.delete('/:id', (req, res) => {
	res.render('postList');
});




module.exports = router;