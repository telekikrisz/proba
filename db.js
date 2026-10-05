import adatbazis from "mysql2/promise";
import titkos from "dotenv";

titkos.config();

const adatok = adatbazis.createPool({
  host: process.env.dbhost,
  user: process.env.dbuser,
  password: process.env.dbpass,
  database: process.env.dbname,
});

export default adatok;
