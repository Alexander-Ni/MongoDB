import { Router } from "express";

export function MoviesApi(mongoDatabase) {
  const router = new Router();
  router.get("/", async (req, res) => {
    const movies = await mongoDatabase
      .collection("movies")
      .find()
      .map(({ title, year, directors, plot, genre, poster, countries }) => ({
        title,
        year,
        directors,
        plot,
        genre,
        poster,
        countries,
      }))
      .limit(200)
      .toArray();
    res.json(movies);
  });
  router.post("/new", (req, res) => {
    const { title } = req.body;
    const result = mongoDatabase.collection("movies").insertOne({
      title,
    });
    res.sendStatus(500);
  });

  return router;
}
