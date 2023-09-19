const {Post, User,Comment} = require('../models');
const e = require("express");

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
};

exports.uploadPost = async (req, res, next) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            UserId: req.user.id,
        });
        res.status(200).send(post);
    } catch (error) {
        console.error(error);
        res.status(500).json('글 작성 오류');
        next(error);
    }
};

exports.updatePost = async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await Post.findOne({where: {id: postId}})
        if (post.UserId !== req.user.id) {
            return res.status(500).json('글 수정 권한이 없습니다.')
        }
        const updatedPost = await Post.update({
                content: req.body.content,
                img: req.body.url,
            }, {where: {id: postId}}
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json('글 수정 오류');
        next(err);
    }
};


exports.getPostList = async (req, res) => {

    try {
        // posts 테이블에서 id, UserId, createdAt 컬럼 가져오기
        const posts = await Post.findAll({
            attributes: ['id', 'UserId', 'createdAt', 'content']
        });
        res.status(200).send({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 에러');
    }
};


exports.getPost = async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await Post.findOne({where: {id: postId}});
        res.status(200).send(post);
    } catch (err) {
        console.error(err);
        res.status(500).send("서버 에러");
        next(err);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({where: {id: req.params.id}})
        if (post.UserId !== req.user.id) {
            return res.status(403).json('글 삭제 권한이 없습니다.')
        }
        const deletedPost = await Post.destroy({where: {id: req.params.id}})
        next();
    } catch (err) {
        console.error(err);
        res.status(500).error(err);
        next(err);
    }
};