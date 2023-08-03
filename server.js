// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const DB_URL = process.env.DB_URL;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
// add your mongodb url to run
mongoose
  .connect(
    "Enter url here",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected sucsessfully.....");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const photoSchema = new mongoose.Schema({
  imageUrl: String,
});

const Photo = mongoose.model("Photo", photoSchema);

// GET photos with pagination
app.get("/api/photos", async (req, res) => {
  //I have created functionality to add images in diffent pages,
  const perPage = 15;
  const page = req.query.page || 1;

  try {
    const photos = await Photo.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const totalPhotos = await Photo.countDocuments();
    res.json({
      photos,
      currentPage: page,
      totalPages: Math.ceil(totalPhotos / perPage),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
