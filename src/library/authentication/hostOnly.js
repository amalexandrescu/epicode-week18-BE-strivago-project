import createHttpError from "http-errors";
import UsersModel from "../../apis/users/model.js";

const hostOnlyMiddleware = async (req, res, next) => {
  //this req.user._id is coming from host only middleware where we overwrite the user
  //if the credentials match
  const user = await UsersModel.findById(req.user._id);

  if (user.role.toString() === "host") {
    next();
  } else {
    next(createHttpError(403, "This endpoint is available just for hosts!"));
  }
};

export default hostOnlyMiddleware;
