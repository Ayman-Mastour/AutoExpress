import pool from "../config/database.js";
import { BASE_URL } from "../server.js";
//function pour la page admin
export const Admin = (req, res) => {
  pool.query(
    //requete pour recupere les donnes
    `SELECT Cars.id, Brand, Model, Year, DailyRate, PhotoPath, alt, agencies.id AS agency_id, agencies.name AS agency_name FROM Cars LEFT JOIN  Photos ON Photos.Car_id = Cars.id LEFT JOIN agencies ON Cars.agency_id = agencies.id ORDER BY Year DESC LIMIT 5`,
    function (err, posts, field) {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur lors de la récupération des données');
      }

      pool.query('SELECT * FROM agencies', 

      (error, agencies, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Erreur lors de la récupération des agences');
      }

        res.render('admin', { posts, agencies, base_url: BASE_URL });
      });
    }
  );
};

//function pour ajouer des vehicule
export const AddCar = (req, res) => {
  let sql = `SELECT id, name FROM agencies`;

		pool.query(sql, function (err, agencies, field) {
		res.render("addCar", { base_url: BASE_URL, agencies: agencies });
	});
};
//Fonction pour soumettre l'ajout d'une voiture
export const AddCarSubmit = (req, res) => {
const { Brand, Model, Year, DailyRate, agency} = req.body;

// Requête SQL pour insérer une nouvelle voiture
    let carInsertSQL = `INSERT INTO Cars (Brand, Model, Year, DailyRate, agency_id) VALUES (?,?,?,?,?)`;

    pool.query(
      // Exécution de la requête SQL
        carInsertSQL,
        [Brand, Model, Year, DailyRate, agency],
        function (err, carResult, carFields) {
            if (err) {
                console.log(err);
            } else {
                // Récupérez l'ID de la voiture insérée
                const carId = carResult.insertId;

                pool.query(
                    "INSERT INTO Photos (PhotoPath, alt, Car_id) VALUES (?,?,?)",
                    [req.file.filename, Brand, carId],
                    (error, result, fields3) => {
                        
                        console.log(result);
                        if (error) {
                            console.log(error);
                        }
                    },
                );
                
                //redirection vers la page admin
                res.redirect("/admin");
            }
        }
    );
};
// Fonction pour supprimer une voiture
export const DeleteCar = (req, res) => {
	let id = req.params.id;
// requete sql pour supprimer une voiture par id
	let sql = `DELETE FROM Cars WHERE id = ?`;

	pool.query(sql, [id], function (err, result, field) {
		res.redirect("/admin");
	});
};

// Fonction pour modifier une voiture
export const EditCar = (req, res, post) => {
  const id = req.params.id;
  // requete sql pour recuperer les information par id
  const sqlCars = 'SELECT * FROM Cars WHERE id = ?';
  const sqlAgencies = 'SELECT * FROM agencies';

  pool.query(sqlCars, [id], (errCars, rowsCars) => {
    //si error véhicule
    if (errCars) {
      console.error(errCars);
      //affiche message error
      return res.status(500).send('Erreur lors de la récupération de l\'article à modifier');
    }

    pool.query(sqlAgencies, (errAgencies, rowsAgencies) => {
      //si error agence
      if (errAgencies) {
        console.error(errAgencies);
        //alors affiche message error
        return res.status(500).send('Erreur lors de la récupération des agences');
      }
  // Affichage du template pour éditer une voiture
      res.render('editCar', { base_url: BASE_URL, post: rowsCars[0], agencies: rowsAgencies });
    });
  });
};


//fonction pour soumettre la modification
export const EditCarSubmit = (req, res) => {
  const id = req.params.id;
  const { brand, model, year, dailyRate, agency_id } = req.body;

  const sql = 'UPDATE Cars SET Brand = ?, Model = ?, Year = ?, DailyRate = ?, agency_id = ? WHERE id = ?';

  pool.query(sql, [brand, model, year, dailyRate, agency_id, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erreur lors de la mise à jour de l\'article');
    }

    console.log(result);
    // redirection vers la page admin
    res.redirect('/admin');
  });
};


//fonction pour ajouter une agence
export const addAgency = (req, res) => {
  res.render('addAgency', { base_url: BASE_URL });
};
//fonction pour soumettre l'ajout d'une agence
export const addAgencySubmit = (req, res) => {
  const { name, latitude, longitude } = req.body; 
  
  pool.query(
    // requete sql pour inserer les information suivantes dans la bdd
    'INSERT INTO agencies (name, latitude, longitude) VALUES (?,?,?)',
    [name, latitude, longitude], 
    (error, results) => {
      //gesion error
      if (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
        return;
      }

      res.redirect('/admin');
    }
  );
};
//fonction pour modifier une agence
export const EditAgency = (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM agencies WHERE id = ?';

  pool.query(sql, [id], (err, rows) => {
    //gestion error
    if (err) {
      console.error(err);
      return res.status(500).send('Erreur lors de la récupération de l\'agence à modifier');
    }

    res.render('editAgency', { base_url: BASE_URL, agency: rows[0] });
  });
};
//fonction pour soumettre la modification d'une agence
export const EditAgencySubmit = (req, res) => {
  const id = req.params.id;
  const { name, latitude, longitude } = req.body;

  const sql = 'UPDATE agencies SET name = ?, latitude = ?, longitude = ? WHERE id = ?';

  pool.query(sql, [name, latitude, longitude, id], (err, result) => {
    //gestion error
      if (err) {
          console.error(err);
          return res.status(500).send('Erreur lors de la mise à jour de l\'agence');
      }

      console.log(result);
      res.redirect('/admin'); 
  });
};


//fonction pour supp une agence
export const DeleteAgency = (req, res) => {
	let id = req.params.id;
  //supression agence par id
	let sql = `DELETE FROM agencies WHERE id = ?`; 

	pool.query(sql, [id], function (err, result, field) {
    // redirection vers page admin
		res.redirect("/admin");
	});
};


