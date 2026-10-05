import adatbazis from "./db.js";
import exp, { response } from "express";
import titkos from "dotenv";

titkos.config();

const port = process.env.port || 3000;

const app = exp();
app.use(exp.json());

app.get("/tanulok", async (req, res) => {
  try {
    const [adatok] = await adatbazis.query("select * from tanulo");
    res.status(200).json(adatok);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Adatbázis hiba." });
  }
});

app.post("/tanulok", async (req, res) => {
  try {
    const { nev, szak } = req.body;
    if (!nev || !szak)
      return res.status(400).json({ error: "A név és szak megadása kötelező" });
    const [adatok] = await adatbazis.query(
      "insert into tanulo(nev,szak) values (?,?)",
      [nev, szak],
    );
    res.status(201).json({
      id: adatok.insertId,
      nev: nev,
      szak: szak,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Adatbázis hiba." });
  }
});

app.put("/tanulok/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nev, szak } = req.body;

    if (!nev || !szak) {
      return res
        .status(400)
        .json({ error: "A név és a szak megadása kötelező!" });
    }

    const [result] = await adatbazis.query(
      "UPDATE tanulo SET nev = ?, szak = ? WHERE id = ?",
      [nev, szak, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "A megadott azonosítójú tanuló nem található!" });
    }

    res.status(200).json({
      message: "Tanuló adatai sikeresen frissítve!",
      id: Number(id),
      nev,
      szak,
    });
  } catch (error) {
    console.error("Adatbázis hiba:", error.message);
    res.status(500).json({ error: "Adatbázis hiba történt!" });
  }
});

app.delete("/tanulok/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // SQL DELETE lekérdezés futtatása
    const [result] = await adatbazis.query("DELETE FROM tanulo WHERE id = ?", [
      id,
    ]);

    // Ha 0 sort érintett, akkor nem létezett az adott ID-jű tanuló
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "A megadott azonosítójú tanuló nem található!" });
    }

    // Sikeres törlés válasza (200 OK megerősítő üzenettel)
    res.status(200).json({
      message: "Tanuló sikeresen törölve!",
      id: Number(id),
    });
  } catch (error) {
    console.error("Adatbázis hiba:", error.message);
    res.status(500).json({ error: "Adatbázis hiba történt!" });
  }
});

app.listen(port, () => {
  console.log("A szerver fut a http://localhost:" + port + " címen");
});
