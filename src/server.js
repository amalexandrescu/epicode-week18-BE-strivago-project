import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./apis/users";

const server = express();

const port = process.env.PORT || 3001;

//MIDDLEWARES

server.use(cors());
server.use(express.json());

//ENDPOINTS

server.use("/users", usersRouter);

//ERROR HANDLERS
