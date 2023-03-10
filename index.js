const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jallqro.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const serviceCollection = client.db("dentalCare").collection("services");
        const reviewCollection = client.db("dentalCare").collection("reviews");
        const appointmentCollection = client.db("dentalCare").collection("appointment");

        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            // console.log(services);
            res.send(services);
        });
        app.get("/allServices", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            // console.log(services);
            res.send(services);
        });
        app.get("/reviews", async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const services = await cursor.toArray();
            // console.log(services);
            res.send(services);
        });

        app.get("/myReviews", async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email,
                };
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            // console.log(services);
            res.send(review);
        });

        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            // console.log(service);
            res.send(service);
        });

        app.post("/services", async (req, res) => {
            const service = req.body;
            // console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });
        app.post("/appointments", async (req, res) => {
            const appointment = req.body;
            // console.log(service);
            const result = await appointmentCollection.insertOne(appointment);
            res.send(result);
        });
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            // console.log(service);
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
    } finally {
    }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
    res.send("dental care server is running");
});

app.listen(port, () => {
    console.log(`Dental server running on ${port}`);
});
