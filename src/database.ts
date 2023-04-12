import { Client } from "pg";

const client: Client = new Client({
  user: "cleyv",
  host: "localhost",
  port: 5432,
  password: "4050",
  database: "database_movies",
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
};

export { startDatabase, client };
