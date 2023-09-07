const {Post,user,Comment} = require('../models')
const e = require("express");


exports.uploadComment = async (req, res, next) => {
	try {
		const comment = await Comment.create({
			comment: req.body.comment,
			commenter: req.user.id,
		});
		res.status(200).send(comment);
	} catch (error) {
		console.error(error);
		res.status(500).json('댓글 작성 오류');
		next(error);
	}
};

exports.updateComment = async (req, res, next) => {
	const commentId = req.params.id;
	const {comment} = req.body;

	try {
		const comment = await Comment.findOne({where: {id:commentId}})

		if (comment.commenter !== req.user.id) {
			return res.status(403).json('작성자만 수정 할 수 있습니다..')
		}

		const updatedComment = await Comment.update({
				comment: req.body.comment,
			}, {
			where: {id: commentId}
		});
		res.status(200).json('댓글 수정 완료');
	} catch (err) {
		console.log(err);
		res.status(500).json('댓글수정 오류');
		next(err);
	}
};

exports.getCommentList = async (req, res) => {

	try {

		const commentid = req.params.id

		// posts 테이블에서 id, UserId, createdAt 컬럼 가져오기
		const comment = await Comment.findAll({
			attributes: ['commenter', 'comment'],
			where:{id: commentid}
		});
		res.status(200).json(comment);
	} catch (error) {
		console.error(error);
		res.status(500).send('서버 에러');
	}
};

exports.deleteComment = async (req, res, next) => {
	try {
		const comment = await Comment.findOne({where: {id:req.params.id}})
		if (comment.commenter !== req.user.id) {
			return res.status(403).json('글 삭제 권한이 없습니다.')
		}
		const deletedPost = await Comment.destroy({where: {id:req.params.id}})
		res.status(200).json(deletedPost);
	} catch (err){
		console.error(err);
		res.status(500).error(err);
		next(err);
	}
};