import Joi from "joi";

export const userInputValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  role: Joi.string().valid("admin", "member").required(),
});
