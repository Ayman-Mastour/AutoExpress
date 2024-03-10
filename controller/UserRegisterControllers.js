import pool from "../config/database.js";
import bcrypt from "bcrypt";
import {BASE_URL} from "../server.js";
// Nombre de tours pour le hachage du mot de passe
const saltRounds = 10;
// Contrôleur pour rendre la page d'inscription des utilisateurs

export const UsersRegister = (req, res) => {
    res.render("usersRegister", {
        base_url: BASE_URL
    });
}
// Contrôleur pour soumettre le formulaire d'inscription des utilisateurs
export const registerUserSubmit = (req, res) => {

    if (!req.body.pwd || !req.body.name || !req.body.firstname || req.body.email) {
        return res.render("usersRegister", {
            message: "Veuillez remplir tous les champs",
            base_url: BASE_URL,
        });
    }

    bcrypt.hash(req.body.pwd, saltRounds, function (err, hash) {
        // Insérer les données de l'utilisateur dans la base de données
        pool.query(
            "INSERT INTO users (name, firstname, email, password) VALUES (?,?,?,?)",
            [req.body.name, req.body.firstname, req.body.email, hash],
            function (error, result, fields) {
                //gestion error
                if (result) {
                    res.redirect("/loginUsers");
                } else {
                    res.render("usersRegister", {
                        message: "Ressayez",
                        base_url: BASE_URL,
                    })
                }
            }
        )
    })
}