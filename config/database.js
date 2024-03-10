import mysql from "mysql";

let pool = mysql.createPool({
    host: "db.3wa.io",
    password: "799dd457b252396958511ef314823928",
    database: "aymanmastour_PROJET",
    user: "aymanmastour"
});

pool.getConnection((err, connection) => {
    console.log("Connected to the database");
    if(err) throw err;
});

export default pool;