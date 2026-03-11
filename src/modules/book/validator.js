import Joi from "joi";

export const bookInputValidation = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  publishedYear: Joi.number().required(),
  availableCopies: Joi.number().required(),
});

export const bookUpdateValidation = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  publishedYear: Joi.number(),
  availableCopies: Joi.number(),
}).min(1);
