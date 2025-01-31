import { Router } from "express";
const { signup } = require("../controllers/sign.controller/signup.controller");
const { signin } = require("../controllers/sign.controller/signin.controller");
const router = Router();

router.post("/signup", signup);
router.get("/signin", signin)

export default router;