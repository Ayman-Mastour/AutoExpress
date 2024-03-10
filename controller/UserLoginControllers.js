import bcrypt from "bcrypt";
import pool from "../config/database.js";
import {BASE_URL} from "../server.js";

// Contrôleur pour rendre la page de connexion des utilisateurs
export const UsersLogin = (req, res) => {
  res.render("loginUsers", {
    base_url: BASE_URL
  });
};

// Contrôleur pour soumettre le formulaire de connexion des utilisateurs
export const UsersLoginSubmit = (req, res) => {
  const {email,pwd} = req.body;

  // rechercher l'user dans la bdd
  pool.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {

    if (error) {
      // Gestion des erreurs lors de la recherche de l'utilisateur
      console.error("Erreur de recherche de l'utilisateur :", error);
      return res.render("loginUsers", {
        message: "Erreur de connexion"
      });
    }

    if (results.length === 0) {
      // Si aucun utilisateur trouvé avec l'email saisi
      return res.render("loginUsers", {
        message: "Identifiants introuvables"
      });
    }

    // comparer le mot de passe haché stocké avec le mpd saisi
    bcrypt.compare(pwd, results[0].password, (err, result) => {
      //gestion error
      if (err || !result) {
        return res.render("loginUsers", {
          message: "Identifiants incorrects"
        });
      }

      req.session.isLoggedIn = true;
      req.session.isAdmin = false;
      res.redirect("/");

    });

  });
};
// Contrôleur pour la déconnexion de l'utilisateur
export const Logout = (req, res) => {
  //destruction de la session
  req.session.destroy((err) => {
    //redirection vers page d'acceuil
    res.redirect("/");
  });
};