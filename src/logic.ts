import { Request, Response, query } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import { TMovies, TMoviesResquest } from "./interfaces";
import format from "pg-format";

const createMovies = async (req: Request, res: Response): Promise<Response> => {
  const moviesData: Partial<TMoviesResquest> = req.body;

  const queryString: string = format(
    `
  INSERT INTO
    movies
    (%I)
   VALUES
    (%L)
   RETURNING *;
   `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryResult: QueryResult<TMovies> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const getMovies = async (req: Request, res: Response): Promise<Response> => {
  let queryString: string = ``;
  const category: any = req.query.category;

  if (category) {
    queryString = `SELECT * FROM movies WHERE category = $1;`;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [category],
    };

    const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

    if (queryResult.rows.length <= 0) {
      queryString = `SELECT * FROM movies;`;

      const queryResult: QueryResult<TMovies> = await client.query(queryString);

      return res.json(queryResult.rows);
    } else {
      return res.json(queryResult.rows);
    }
  } else {
    queryString = `SELECT * FROM movies;`;

    const queryResult: QueryResult<TMovies> = await client.query(queryString);

    return res.json(queryResult.rows);
  }
};

const getMoviesById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const index: number = res.locals.movieIndex;
  const movies: Array<TMovies> = res.locals.movies;

  return res.json(movies[index]);
};

const updateMoviesById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const moviesData: Partial<TMoviesResquest> = req.body;
  const id: number = Number(req.params.id);

  const queryString: string = format(
    `
    UPDATE
        movies
        SET(%I) = ROW(%L)
    WHERE
        id = $1
    RETURNING *;
    `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  console.log(queryConfig);

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteMoviesById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = Number(req.params.id);

  const queryString: string = `
   DELETE FROM
    movies
   WHERE
    id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

export {
  createMovies,
  getMovies,
  getMoviesById,
  updateMoviesById,
  deleteMoviesById,
};
