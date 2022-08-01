import express, { response } from "express";

const dotenv = require("dotenv");
const app = express();

app.use(express.json());

app.get("/", (req: any, res: { send: (arg0: string) => void; }) => {
	res.send("Hello World");
});

dotenv.config();

function generateToken(username: string) {

}

app.post("/api/createUser", (req, res) => {
	console.log(req.body);
	res.send(req.body.username);
});

app.listen(8000, ()=> {
	console.log("Application listening at http://localhost:8000");
});