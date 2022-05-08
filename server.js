import express from 'express'
import cors from 'cors';

import helloController from "./controllers/hello-controller.js";
import userController from "./controllers/user-controller.js";
import tuitsController from "./controllers/tuits-controller.js";
import mongoose from "mongoose";
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import User from './models/user_model.js';
import Twitter from 'twitter';
import needle from "needle"
const DB_CONNECTION_STRING = 'mongodb+srv://tharamesseroux:braTtitude17*@cluster0.xssrp.mongodb.net/webdev?retryWrites=true&w=majority';
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/webdev'
mongoose.connect(CONNECTION_STRING);

// helloController(app);`
// userController(app);
// tuitsController(app);

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', async(req,res) => {
	res.send("Welcome to backend development")

})
// asynchronous
app.post('/api/register', async(req, res) => {
	console.log(req.body);
	try{
			const user = await User.create(
					{
						name: req.body.name,
						username: req.body.username,
						email: req.body.email,
						password: req.body.password,
						phone: req.body.phone,
						dob: req.body.dob,
						college: req.body.college
					}
			);
			res.json({ status: 'ok' })
	} catch(err){
			res.status(400).send(err);
	}
});

app.post('/api/login', async(req, res) => {
	const user = await User.findOne({
			username: req.body.username,
			password: req.body.password
	});
	if(user){
			const token = jsonwebtoken.sign({
					id: user._id,
					username: user.username,
					password: user.password,
					email: user.email,
					phone: user.phone,
					dob: user.dob,
					college: user.college
			}, 'secret123', {
					expiresIn: '1h'
			});
			res.json({
					user,
					token
			})
			console.log(token);
	} else {
			res.json({
					status: 'error',
					message: 'Invalid username or password'
			})
	}
});

// delete user
app.delete('/api/user/:id', async(req, res) => {
	try{
			const user = await User.findByIdAndDelete(req.params.id);
			res.json({ status: 'ok' })
	} catch(err){
			res.json({ status: 'error', message: err })
	}
});

// edit user
app.put('/api/edituser/:id', async(req, res) => {
	try{
			const user = await User.findByIdAndUpdate(req.params.id, req.body);
			res.json({ status: 'ok' })
	} catch(err){
			res.json({ status: 'error', message: err })
	}
});

// getting all the users
app.get('/api/users', async(req, res) => {
	try{
			const users = await User.find();
			res.json({ status: 'ok', users })
	} catch(err){
			res.json({ status: 'error', message: err })	
	}
})

// getting userid info
app.get('/api/user/:id', async(req, res) => {
	try{
			const user = await User.findById(req.params.id);
			res.json({ status: 'ok', user })
	} catch(err){
			res.json({ status: 'error', message: err })
	}
});

// getting user info with username
app.get('/api/user/username/:username', async(req, res) => {
	try{
			const user = await User.findOne({ username: req.params.username });
			res.json({ status: 'ok', user })
	} catch(err){
			res.json({ status: 'error', message: err })
	}
})

app.listen(process.env.PORT || 4000, () => {
	console.log("Welcome to backend development");
});
