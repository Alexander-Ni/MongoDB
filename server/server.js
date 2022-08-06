import express from "express";
import * as path from "path";
import { MoviesApi } from "./moviesApi.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.MONGODB_URL);

mongoClient.connect().then(async () => {
  console.log("Connected to mongodb");
  app.use("/api/movies", MoviesApi(mongoClient.db("movie-database-test")));
});

app.use(express.static("../client/dist"));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

app.post("/api/movies", async (req, res) => {
  const database = mongoClient.db("movie-database-test");
  const { title, year, directors, plot, countries } = req.body;
  const result = await database.collection("movies").insertOne({
    title,
    year,
    directors,
    plot,
    countries,
  });
  console.log({ result });
  res.sendStatus(200);
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Started on http://localhost:${server.address().port}`);
});
