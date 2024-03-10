import pool from "../config/database.js";
import {
  BASE_URL
} from "../server.js";

// Contrôleur pour obtenir les voitures et les agences
export const getCarsAndAgencies = async (req, res) => {
  try {
    const agencyId = req.params.agencyId;
    const cars = await getCars();
    const agencies = await getAgencies();

    res.render('Maps', {
      cars,
      agencies,
      base_url: BASE_URL,
      agencyId,
    });
    //gestion error
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    res.status(500).send('Erreur interne du serveur');
  }
};
// Contrôleur pour obtenir les détails des voitures par agence
export const getCarDetailsByAgency = async (req, res) => {
  try {
    const agencyId = req.params.agencyId;

    // utiliser la fonction pour récupérer les détails des voiture associée a une agence depuis la bdd
    const carDetails = await getCarDetailsByAgencyId(agencyId); //pour récupérer les détails des voitures par agence

    res.json(carDetails); // renvoyer les détails des voitures au format JSON
  } catch (error) {
    console.error('Erreur lors de la récupération des détails des voitures par agence :', error);
    res.status(500).send('Erreur interne du serveur');
  }
};
// Fonction pour obtenir les détails des voitures par ID d'agence
const getCarDetailsByAgencyId = (agencyId) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT Cars.id, Brand, Model, Year, DailyRate, PhotoPath, alt FROM Cars LEFT JOIN Photos ON Photos.Car_id = Cars.id WHERE agency_id = ?`;
    pool.query(sql, [agencyId], (err, carDetails) => {
      //gestion error
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(carDetails);
      }
    });
  });
};

// Fonction pour obtenir les dernières voitures
const getCars = () => {
  return new Promise((resolve, reject) => {
    //recuperation des données de Cars et de tout ce qui est lié a Cars
    let sql = "SELECT Cars.id, Brand, Model, Year, DailyRate, PhotoPath, alt FROM Cars LEFT JOIN Photos ON Photos.Car_id = Cars.id ORDER BY Year DESC LIMIT 5";
    pool.query(sql, (err, cars) => {
      //gestion error
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(cars);
      }
    });
  });
};
// Fonction pour obtenir les agences
const getAgencies = () => {
  return new Promise((resolve, reject) => {
    //recperation des données stocker en bdd
    const query = 'SELECT id, name, latitude, longitude FROM agencies';
    pool.query(query, (error, agencies) => {
      //gestion error
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(agencies);
      }
    });
  });
};

