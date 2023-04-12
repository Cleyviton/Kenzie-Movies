import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { TMovies, TMoviesResquest } from "./interfaces";
import { client } from "./database";

const verifyNameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const queryString: string = `SELECT * FROM movies;`;
  const queryResult: QueryResult<TMovies> = await client.query(queryString);
  const newMovie: TMoviesResquest = req.body;

  const find: TMovies | undefined = queryResult.rows.find(
    (movie: TMovies) => movie.name == newMovie.name
  );

  if (find) {
    return res.status(409).json({ error: "Movie name already exists!" });
  }

  res.locals.movies = queryResult.rows;

  return next();
};

const verifyIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = Number(req.params.id);
  const queryString: string = `SELECT * FROM movies;`;
  const queryResult: QueryResult<TMovies> = await client.query(queryString);

  const find = queryResult.rows.findIndex((movie: TMovies) => movie.id == id);

  if (find < 0) {
    return res.status(404).json({ error: "Movie not found!" });
  }

  res.locals.movieIndex = find;
  res.locals.movies = queryResult.rows;

  return next();
};

export { verifyNameExists, verifyIdExists };
