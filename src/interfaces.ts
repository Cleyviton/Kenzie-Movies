type TMovies = {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
};

type TMoviesResquest = Omit<TMovies, "id">;

export { TMovies, TMoviesResquest };
