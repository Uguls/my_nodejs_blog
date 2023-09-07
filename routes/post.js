const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, updatePost, getPostList, deletePost, getPost} = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

try {
	fs.readdirSync('uploads');
} catch (error) {
	console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
	fs.mkdirSync('uploads');
}

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, 'uploads/');
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
});


router.get('/detail/:id', isLoggedIn, getPost);

// CREATE
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// CREATE
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

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