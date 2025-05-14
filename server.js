/******************************************************************************** 
*  WEB422 – Assignment 1 
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html 
*  
*  Name: ___Tzuyi Lin____ Student ID: __127201234__ Date: __2025/05/16__ 
* 
*  Published URL on Vercel:   
* 
********************************************************************************/ 
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Listening",
    term: "Summer 2025",
    student: "Tzuyi Lin"
  });
});

// Add new site
app.post("/api/sites", async (req, res) => {
  try {
    const newSite = await db.addNewSite(req.body);
    res.status(201).json(newSite);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get all sites
// /api/sites?page=1&perPage=5&name=can 
// /api/sites?page=1&perPage=8&region=West 
// /api/sites?page=1&perPage=8&provinceOrTerritory=ontario 
app.get("/api/sites", async (req, res) => {
  try {
    const { page, perPage, name, region, provinceOrTerritoryName } = req.query;
    const sites = await db.getAllSites(page, perPage, name, region, provinceOrTerritoryName);
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get site by ID
// /api/sites/68240d9db558be072364a1d8
app.get("/api/sites/:id", async (req, res) => {
  try {
    const site = await db.getSiteById(req.params.id);
    if (site) {
      res.json(site);
    } else {
      res.status(404).json({ message: "Site not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Update site by ID
// /api/sites/66d50a4564305e9f78367fed
app.put("/api/sites/:id", async (req, res) => {
  try {
    await db.updateSiteById(req.body, req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Delete site by ID
// /api/sites/66d50a4564305e9f78367fed
app.delete("/api/sites/:id", async (req, res) => {
  try {
    await db.deleteSiteById(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.log(err);
});