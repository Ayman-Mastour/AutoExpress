//importation de express
import express from "express";
import { Register, RegisterSubmit } from "../controller/RegisterControllers.js";
import { Login, LoginSubmit, Logout } from "../controller/LoginControllers.js";
import {
	Admin,
	AddCarSubmit,
	AddCar,
	DeleteCar,
	EditCar,
	EditCarSubmit,
	addAgency, 
	addAgencySubmit,
	EditAgency,
	EditAgencySubmit,
	DeleteAgency
} from "../controller/AdminControllers.js";
import HomeController from "../controller/HomeController.js";
import { UsersLogin, UsersLoginSubmit } from "../controller/UserLoginControllers.js";
import { UsersRegister, registerUserSubmit } from "../controller/UserRegisterControllers.js";
import upload from "../healper/uploader.js";
import {getCarsAndAgencies, getCarDetailsByAgency} from "../controller/MapControllers.js";
// importaion de stripe et clé privé
import Stripe from "stripe";
const stripe = new Stripe('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');


const router = express.Router();


router.get("/", HomeController);

router.get("/admin", Admin);

router.get("/addCar", AddCar);
router.post("/addCar", upload.single("Photos"), AddCarSubmit);

router.get("/deleteCar/:id", DeleteCar);

router.get("/editCar/:id", EditCar);
router.post("/editCar/:id", EditCarSubmit);

router.get("/register", Register);
router.post("/register", RegisterSubmit);

router.get("/login", Login);
router.post("/login", LoginSubmit);

router.get("/usersRegister", UsersRegister);
router.post("/usersRegister", registerUserSubmit);

router.get("/loginUsers", UsersLogin);
router.post("/loginUsers", UsersLoginSubmit);

router.get("/logout", Logout);

router.get("/Maps", getCarsAndAgencies)
router.get('/car-details/:agencyId', getCarDetailsByAgency);

router.get('/addAgency', addAgency);
router.post('/addAgency', addAgencySubmit);

router.get('/editAgency/:id', EditAgency);
router.post('/editAgency/:id', EditAgencySubmit);

router.get("/deleteAgency/:id", DeleteAgency);

router.get('/Payment', (req, res) => {
	res.render('payment')
});

router.get('/cancel', (req, res) => {
	res.render('cancel')
});

router.get('/pop', (req, res) => {
	res.render('pop')
})


// Page de paiement 'api stripe'
router.post('/create-checkout-session', async (req, res) => {

	const session = await stripe.checkout.sessions.create({
	  line_items: [{
		price_data: {
		  currency: 'eur',
		  product_data: {
			name: `Mercedes`,
		  },
		  unit_amount: 10 * 100,// en centime par default donc x100
		},
		quantity: 1,
	  }],
	  mode: 'payment',
	  ui_mode: 'embedded',
	  return_url: 'http://localhost:7005/cancel'
	});
  	
	res.send({clientSecret: session.client_secret});
	});
	

export default router;