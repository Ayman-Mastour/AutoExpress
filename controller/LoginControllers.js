import pool from "../config/database.js";
import bcrypt from "bcrypt";
import { BASE_URL } from "../server.js";
// Contrôleur pour la page de connexion
export const Login = (req, res) =>{
    res.render("login", { base_url: BASE_URL});
};
// Contrôleur pour la soumission du formulaire de connexion
export const LoginSubmit = (req, res) => {
    // verification d'email deja existant
    pool.query(
        "SELECT * FROM admin WHERE email = ?",
        [req.body.email],
        function (error, admin, fields2) {
            console.log(admin);

            if (admin.length > 0){
                //Compare mdp
                bcrypt.compare(req.body.pwd, admin[0].password, function (err, result){
                    //gestion error
                    if (result) {
                        //permission
                        req.session.isAdmin = true;
                        res.redirect("/")
                    } else {
                        //sinon error
                        res.render("login", {
                            message: "identifiants incorrect",
                            base_url: BASE_URL,
                        });
                    }
                });
            }
            // Si l'email n'existe pas dans la base de données, un message est renvoyé à la page de connexion
            else{
                res.render("login", {
                    message: "Identifiants Introuvable",
                    base_url: BASE_URL,
                });
            }
            
        },
    );
};
// Contrôleur pour la déconnexion de l'administrateur
export const Logout = (req, res) => {
    //destruction de la session
	req.session.destroy((err) => {
        //redirect vers home
		res.redirect("/");
	});
};