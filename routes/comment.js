const express = require('express');
const { Comment } = require('../models');

const { isLoggedIn } = require('../middlewares');
const {uploadComment, updateComment, getCommentList, deleteComment} = require("../controllers/comments");

const router = express.Router();

// CREATE
// /comments/upload
router.post('/upload', isLoggedIn, uploadComment);

// READ
// /comments/:id
router.get('/:id', isLoggedIn, getCommentList)

// UPDATE
// /comments/update/:id
router.patch('/update/:id', isLoggedIn, updateComment);

// DELETE
// /comments/delete/:id
router.delete('/delete/:id', isLoggedIn, deleteComment);

module.exports = router;