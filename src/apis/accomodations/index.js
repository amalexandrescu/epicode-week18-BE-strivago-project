import express from "express";
import createHttpError from "http-errors";
import AccomodationsModel from "./model.js";
const accomodationsRouter = express.Router();

accomodationsRouter.post("/", async (req, res, next) => {
  try {
    if (req.body.host === "host") {
      const newAccomodation = await AccomodationsModel(req.body);
      const { _id } = await newAccomodation.save();
      res.status(201).send({ _id });
    } else {
      next(createHttpError(400, "Please provide a host, not a guest"));
    }
  } catch (error) {
    next(error);
  }
});

accomodationsRouter.get("/", async (req, res, next) => {
  try {
    const accomodations = await AccomodationsModel.find().populate({
      path: "host",
    });
    res.send(accomodations);
  } catch (error) {
    next(error);
  }
});

accomodationsRouter.get("/:accomodationId", async (req, res, next) => {
  try {
    const accomodation = await AccomodationsModel.findById(
      req.params.accomodationId
    ).populate({
      path: "host",
    });
    if (accomodation) {
      res.send(accomodation);
    } else {
      next(createHttpError(404, "No accomodations with the provided id found"));
    }
  } catch (error) {
    next(error);
  }
});

export default accomodationsRouter;
