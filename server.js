    import express from "express";
    import router from "./router/router.js";
    import parseurl from "parseurl";
    import session from "express-session"; 

    const app = express();
    const port = 7005;
    const hostname = "localhost";

    export const BASE_URL = `http://${hostname}:${port}`;

    // dossier public par defaut img aussi
    app.use(express.static("public"));
    app.use("/img", express.static("img"));

    // Middleware pour gérer les sessions
    app.use(session({
        secret: "16548za",
        resave: false,
        saveUninitialized: true,
    }));

    //configuration du vue et de ejs
    app.set("views", "./views");
    app.set("view engine", "ejs");

    // configuration du json
    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }));

    //Permission    
    //middleware qui interdit l'accès au page ci-dessous tant que l'user n'est pas connecter
    app.use((req, res, next) => {
        let pathname = parseurl(req).pathname.split("/");
        let protectedPath = ["Payment"];

        if (!req.session.isLoggedIn && !req.session.isAdmin && protectedPath.indexOf(pathname[1]) !== -1) {
            return res.redirect("/pop")
            // Rediriger vers la page de connexion
        } else {
            // Si l'utilisateur est connecté ou la page n'est pas protégée, passez à la suite
            next();
        }

    });

    //middleware qui interdit l'accès au page ci-dessous tant que l'admin n'est pas connecter
    app.use((req, res, next) => {
        let pathname = parseurl(req).pathname.split("/");
        let protectedPath = ["admin", "addCar", "deleteCar", "editCar", "addAgency", "editAgency"];

        if (!req.session.isAdmin && protectedPath.indexOf(pathname[1]) !== -1) {
            res.redirect("/");
        } else {
            // Si l'admin est connecté ou la page n'est pas protégée, passez à la suite
            next();
        }
    });

    // Middleware pour gérer l'état de connexion
    app.use((req, res, next) => {
        if (req.session.isAdmin) {
            res.locals.isAdmin = true;
        } else {
            res.locals.isAdmin = false;
        }

        if (req.session.isLoggedIn) {
            res.locals.isLoggedIn = true;
        } else {
            res.locals.isLoggedIn = false;
        }
        next();
    });

    app.use("/", router);

    //pour afficher si tout est bien connecter
    app.listen(port, () => {
        console.log(`tu est connecté ${BASE_URL} `);
    })