import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
  })
);
// this is used to collect json data from cleint
app.use(
  express.json({
    limit: "20kb",
  })
);
// this setting is used to collect url params data
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
//this setting is used to collect public assets like pdf files , images etc,
// static("file Name")
app.use(express.static("public"));
// this setup is used to access and make CRUD Opperation in user's browser
app.use(cookieParser());
export { app };
