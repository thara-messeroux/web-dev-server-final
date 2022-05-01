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

	try {
        // Make request
        const response = await getRequest();
        console.dir(response, {
            depth: null
        });

    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
    process.exit();
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
					password: user.password
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

// this is the ID for @TwitterDev
const userId = "216178597";
const url = `https://api.twitter.com/2/users/${userId}/tweets`;

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const bearerToken = process.env.BEARER_TOKEN;

app.get('/tweets' , async (req, res) => {
    let userTweets = [];

    // we request the author_id expansion so that we can print out the user name later
    let params = {
        "max_results": 100,
        "tweet.fields": "created_at",
        "expansions": "author_id"
    }

    const options = {
        headers: {
            "User-Agent": "v2UserTweetsJS",
            "authorization": `Bearer ${bearerToken}`
        }
    }

    let hasNextPage = true;
    let nextToken = null;
    let userName;
    console.log("Retrieving Tweets...");

    while (hasNextPage) {
        let resp = await getPage(params, options, nextToken);
        if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
            userName = resp.includes.users[0].username;
            if (resp.data) {
                userTweets.push.apply(userTweets, resp.data);
            }
            if (resp.meta.next_token) {
                nextToken = resp.meta.next_token;
            } else {
                hasNextPage = false;
            }
        } else {
            hasNextPage = false;
        }
    }

    console.dir(userTweets, {
        depth: null
    });
    console.log(`Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`);
	res.send(userTweets);
})

const getPage = async (params, options, nextToken) => {
    if (nextToken) {
        params.pagination_token = nextToken;
    }

    try {
        const resp = await needle('get', url, params, options);

        if (resp.statusCode != 200) {
            console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
            return;
        }
        return resp.body;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
}

app.get('/user', async (req, res) => {
	const endpointURL = "https://api.twitter.com/2/users/by?usernames="

	    // These are the parameters for the API request
	    // specify User names to fetch, and any additional fields that are required
	    // by default, only the User ID, name and user name are returned
	    const params = {
	        usernames: "Thatoue", // Edit usernames to look up
	        "user.fields": "created_at,description,profile_image_url", // Edit optional query parameters here
	        "expansions": "pinned_tweet_id",
	    }

	    // this is the HTTP header that adds bearer token authentication
	    const options = {
			headers: {
				"User-Agent": "v2UserTweetsJS",
				"authorization": `Bearer ${bearerToken}`
			}
		}

		// this is the request to the API
		const resp = await needle('get', endpointURL, params, options);

		// this is the response from the API
		const user = resp.body;
		
		res.send(user);
})

app.listen(process.env.PORT || 4000, () => {
	console.log("Welcome to backend development");
});
