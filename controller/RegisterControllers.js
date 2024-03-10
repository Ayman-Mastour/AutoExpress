import pool from "../config/database.js";
import bcrypt from "bcrypt";
import {BASE_URL} from "../server.js";
// Nombre de tours pour le hachage du mot de passe
const saltRounds = 10;
// Contrôleur pour rendre la page d'inscription

export const Register = (req, res) => {
    res.render("register", {
        base_url: BASE_URL
    });
}
// Contrôleur pour soumettre le formulaire d'inscription
export const RegisterSubmit = (req, res) => {

    if (!req.body.pwd || !req.body.name || !req.body.firstname || req.body.email) {
        return res.render("register", {
            message: "Veuillez remplir tous les champs",
            base_url: BASE_URL,
        });
    }

    bcrypt.hash(req.body.pwd, saltRounds, function (err, hash) {
        pool.query(
            "INSERT INTO admin (name, firstname, email, password) VALUES (?,?,?,?)",
            [req.body.name, req.body.firstname, req.body.email, hash],
            function (error, result, fields) {
                if (result) {
                    res.redirect("/login");
                } else {
                    // Rendu de la page d'inscription avec un message d'erreur en cas d'échec
                    res.render("register", {
                        message: "Ressayez",
                        base_url: BASE_URL,
                    })
                }
            }
        )
    })
}