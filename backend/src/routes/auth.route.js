import express from "express";
import { signup, signin, signout } from "../controllers/auth.controller.js";

const router = express.Router(); // create router

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signout", signout);

export default router;
