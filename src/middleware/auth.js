import jwt from "jsonwebtoken";
import ratelimit from "express-rate-limit";
import dotenv from "dotenv";
import { userModel } from "../databasedConnetion/models/user.model.js";
dotenv.config();

export const auth = (req, res, next) => {
  let { token } = req.headers;
  let ADMINKEY = process.env.ADMINKEY;
  let MEMBERKEY = process.env.MEMBERKEY;

  if (!token) {
    return res.status(401).json({
      message: "Token is required",
    });
  }

  let [bearer, tokenData] = token.split(" ");

  let signiture = " ";

  switch (bearer) {
    case "member":
      signiture = MEMBERKEY;
      break;
    case "admin":
      signiture = ADMINKEY;
  }

  const verifyToken = jwt.verify(tokenData, signiture);

  if (!verifyToken) {
    res.status(401).json({
      message: "Invalid Token",
    });
  } else {
    req.user = verifyToken;
    next();
  }
};

export const createToken = async (user) => {
  let userId = user._id;
  let userRole = user.role;
  let ADMINKEY = process.env.ADMINKEY;
  let MEMBERKEY = process.env.MEMBERKEY;

  let signiture = " ";
  switch (userRole) {
    case "member":
      signiture = MEMBERKEY;
      break;
    case "admin":
      signiture = ADMINKEY;
  }

  if (!signiture) {
    return res.status(401).json({
      message: "Invalid token prefix",
    });
  }

  const token = jwt.sign({ userId }, signiture);

  if (!token) {
    res.status(500).json({
      message: "token has not been created!",
    });
  } else {
    return token;
  }
};

export const allowRoles = (...roles) => {
  return async (req, res, next) => {
    let userId = req.user.userId;
    const user = await userModel.findById(userId);
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "Sorry, you are not authorized for this action!",
      });
    }
    next();
  };
};

export const loginLimiter = ratelimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    message: "Too much login attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
