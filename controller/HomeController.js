import pool from "../config/database.js";
import { BASE_URL } from "../server.js";
 // Contrôleur pour la page d'accueil
const HomeController = (req, res) => {
   
    // Requête SQL pour récupérer les données des voitures avec leurs images liées
    let sql = "SELECT Cars.id, Brand, Model, Year, DailyRate, PhotoPath, alt FROM Cars LEFT JOIN Photos ON Photos.Car_id = Cars.id ORDER BY Year DESC LIMIT 5";

    pool.query(sql, function (err, posts, fields) {
        if (err) {
            // Gérer l'erreur ici
            console.error(err);
            res.status(500).send("Erreur lors de la récupération des données.");
        } else {
            res.render("home", { posts: posts, base_url: BASE_URL });
        }
    });
};

export default HomeController;
