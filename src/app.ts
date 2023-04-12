import express, { Application, json } from "express";
import { startDatabase } from "./database";
import {
  createMovies,
  deleteMoviesById,
  getMovies,
  getMoviesById,
  updateMoviesById,
} from "./logic";
import { verifyIdExists, verifyNameExists } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/movies", verifyNameExists, createMovies);
app.get("/movies", getMovies);
app.get("/movies/:id", verifyIdExists, getMoviesById);
app.patch("/movies/:id", verifyIdExists, verifyNameExists, updateMoviesById);
app.delete("/movies/:id", verifyIdExists, deleteMoviesById);

const PORT: number = 3000;
const runningMessage = `Server running on port ${PORT}`;

app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMessage);
});
