import { userInputValidation } from "./validator.js";
import { userModel } from "../../databasedConnetion/models/user.model.js";
import { createToken } from "../../middleware/auth.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  let { email, password, name, role } = req.body;

  const { error } = userInputValidation.validate({
    email,
    password,
    name,
    role,
  });

  if (error) {
    return res.status(400).json({
      message: "Input Validation Failed",
      errors: error.message,
    });
  }

  const existingEmail = await userModel.findOne({ email: email });
  console.log(existingEmail);
  if (existingEmail) {
    return res.status(409).json({
      message: "Sorry this email is used",
    });
  }

  // put in env
  const SALT = 10;
  const hashedPasswod = await bcrypt.hash(password, SALT);

  const newUser = await userModel.create({
    email,
    password: hashedPasswod,
    name,
    role,
  });

  if (!newUser) {
    res.status(500).json({
      message: "server error",
    });
  } else {
    res.status(201).json({
      message: "user Created Successfully!",
      user: newUser,
    });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "email or password is missing!",
    });
  }

  const existingUser = await userModel.findOne({ email: email });

  if (!existingUser) {
    res.status(404).json({
      message: "Email or password is incorrect",
    });
  } else {
    const hashedPassword = existingUser.password;
    const checkPassword = await bcrypt.compare(password, hashedPassword);

    if (checkPassword) {
      const token = await createToken(existingUser);
      res.status(200).json({
        message: "User login Successfully!",
        token: token,
      });
    } else {
      res.status(200).json({
        message: "email or password is incorrect",
      });
    }
  }
};
export const profile = async (req, res) => {
  const { userId } = req.user;
  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    res.status(404).json({
      message: "User not found!",
    });
  } else {
    res.status(200).json({
      message: "User found!",
      user: user,
    });
  }
};
