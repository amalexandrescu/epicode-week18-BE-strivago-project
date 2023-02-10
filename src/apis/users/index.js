import express from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import hostOnlyMiddleware from "../../library/authentication/hostOnly.js";
import { JWTAuthMiddleware } from "../../library/authentication/jwtAuth.js";
import { createAccessToken } from "../../library/authentication/jwtTools.js";
import UsersModel from "./model.js";
import AccomodationsModel from "../accomodations/model.js";

const usersRouter = express.Router();

//simple post method
//not required
usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

//login user which generates a valid token if the user already exists
//otherwise, error (first you must register)
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //if the user doesn't exist, cannot generate new token
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

//register user which creates a new user and generates a valid token for him
usersRouter.post("/register", async (req, res, next) => {
  try {
    //expectes email, password and role in req.body
    const { email, password, role } = req.body;
    const newUser = await UsersModel(req.body);
    await newUser.save();
    if (newUser) {
      const payload = { _id: newUser._id, role: newUser.role };

      const accessToken = await createAccessToken(payload);
      res.status(201).send({ accessToken });
    }
    //creates a user
    //returns a valid token
  } catch (error) {
    next(error);
  }
});

//get all users
//not required for hw
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

//a user or a host can get his profile
//put the token in the authorization headers
//and you will get all the data for a user that matches the token
usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

//host only endpoint
//gets all the accomodations of a certain host
usersRouter.get(
  "/me/accomodations",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      //user is updated from using JWTAuthMiddleware
      const accomodations = await AccomodationsModel.find({
        host: mongoose.Types.ObjectId(req.user._id),
      });
      if (accomodations) {
        res.send(accomodations);
      } else {
        next(
          createHttpError(404, `This host doesn't have any accomodations yet`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
