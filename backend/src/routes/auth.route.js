import express from "express";
import { signup, signin, signout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { chekAuth } from "../controllers/auth.controller.js";

const router = express.Router(); // create router

router.post("/signup", signup);

router.post("/login", signin);

router.post("/signout", signout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, chekAuth);

export default router;
