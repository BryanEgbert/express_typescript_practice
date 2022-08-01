import express, {Request, Response} from "express";
import { expressjwt } from "express-jwt";
const router = express.Router();


router.use()

router.get("/", (req, res) => {
	console.log(req.body.username)
})

router.post("/new", (req: Request, res: Response) => {
	
})

module.exports = router;