import express from "express";
import createHttpError from "http-errors";
import hostOnlyMiddleware from "../../library/authentication/hostOnly.js";
import { JWTAuthMiddleware } from "../../library/authentication/jwtAuth.js";
import { createAccessToken } from "../../library/authentication/jwtTools.js";
import UsersModel from "./model.js";
import AccomodationsModel from "../accomodations/model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
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

usersRouter.post("/register", async (req, res, next) => {
  try {
    //expectes email, password and role in req.body (name and surname because I put them required too)
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

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/me/accomodations",
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.body.host);
      const hostId = user._id;
      console.log(hostId);
      const accomodations = await AccomodationsModel.find();
      if (accomodations) {
        const searchedAcc = accomodations.filter(
          (acc) => acc.host.toString() === hostId.toString()
        );
        if (searchedAcc) {
          res.send(searchedAcc);
        } else {
          next(
            createHttpError(404, `This host doesn't have any accomodations yet`)
          );
        }
      } else {
        next(createHttpError(404, "No accomodations found."));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
