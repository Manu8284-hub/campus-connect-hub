import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express backend!" });
});

app.post("/echo", (req, res) => {
  res.json({
    message: "Data received successfully",
    data: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
