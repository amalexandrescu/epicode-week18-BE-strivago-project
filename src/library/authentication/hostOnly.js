import createHttpError from "http-errors";
import UsersModel from "../../apis/users/model.js";

const hostOnlyMiddleware = async (req, res, next) => {
  const user = await UsersModel.findById(req.body.host);

  if (user.role.toString() === "host") {
    next();
  } else {
    next(createHttpError(403, "This endpoint is available just for hosts!"));
  }
};

export default hostOnlyMiddleware;
