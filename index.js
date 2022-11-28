const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iz8azxp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next) {

//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send('unauthorized access');
//     }

//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'forbidden access' })
//         }
//         req.decoded = decoded;
//         next();
//     })

// }


async function run() {
    try {
        const usersCollection = client.db('recyclelib').collection('users');
        const booksCollection = client.db('recyclelib').collection('allbooks');
        const categoriesCollection = client.db('recyclelib').collection('categories');
        const modalInfoCollection = client.db('recyclelib').collection('modalinfo');
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.get('/users', async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        app.get('/users/allbuyers/:role', async (req, res) => {
            const role = req.params.role;
            const query = {role: role};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })



        // books section
        app.post('/allbooks', async (req, res) => {
            const book = req.body;
            const result = await booksCollection.insertOne(book);
            res.send(result);
        });
        app.get('/allbooks/category/:categoryid', async (req, res) => {
            const categoryid = req.params.categoryid;
            const query = {bookCategory: categoryid};
            const result = await booksCollection.find(query).toArray();
            res.send(result);
        });

        


        app.post('/modalinfo', async (req, res) => {
            const info = req.body;
            const result = await modalInfoCollection.insertOne(info);
            res.send(result);
        });
        app.get('/dashboard/mybook/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await modalInfoCollection.find(query).toArray();
            res.send(result);
        });




    }
    finally {

    }
}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('recycleLiB server is running');
})

app.listen(port, () => console.log(`Doctors portal running on ${port}`))