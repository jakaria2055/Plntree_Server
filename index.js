import mongoose from "mongoose";
import config from "./src/config/config.js";
import app from "./app.js";

const { PORT, MONGO_URI } = config;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Database connected successfully`);

    app.listen(PORT, () => {
      console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
    });
  })
  .catch((err) => console.log(`DATABASE CONNECTION ERROR: ${err}`));
