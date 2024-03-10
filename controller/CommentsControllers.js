//IMCOMPLET
//IMCOMPLET
import pool from "../config/database.js";
import {BASE_URL} from "../server.js";
//fonction pour ajouter des commentaires
export const CommentController = (req, res) => {
	let id = req.params.id;

	let sql = `SELECT id, Brand, Model, Year, DailyRate FROM Cars WHERE id = ?`;
	let sql2 = `SELECT pseudo, Comment, Date, Car_id FROM Comments WHERE Car_id = ?`;

	pool.query(sql, [id], function (err, com, fields) {
		console.log(com[0]);
		pool.query(sql2, [id], function (err, comments, fields) {
			console.log(comments);
			res.render("addComment", {
				com: com[0],
				base_url: BASE_URL,
				comments: comments,
			});
		});
	});
};

export const AddComment = (req, res) => {

};
//IMCOMPLET
//IMCOMPLET
//IMCOMPLET
