const express = require("express");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(taskRoutes);

if (require.main === module) {
  app.listen(port, (err) => {
    if (err) {
      // Keep startup logging behavior explicit for local runs.
      return console.log("Something bad happened", err);
    }
    return console.log(`Server is listening on ${port}`);
  });
}

module.exports = app;
