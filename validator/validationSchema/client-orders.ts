import * as Ajv from "ajv";
// import Joi from "joi";
// must use `minLength: 1` to implement required field
export const SubmitCardOrderValidation: Ajv.JSONSchemaType<{}> = {
  type: "object",
  properties: {
    productId: { type: "string", nullable: false, minLength: 1 },
    productItemId: {
      type: "string",
      nullable: false,
      minLength: 1,
    },
    accountUserId: {
      type: "string",
      minLength: 1,
      nullable: false,
    },
    accountName: {
      type: "string",
      minLength: 1,
    },
    accountPassword: {
      type: "string",
      // minLength: 1,
    },
    accountServer: {
      type: "string",
      minLength: 1,
    },
    accountCharacterName: {
      type: "string",
      minLength: 1,
    },
    contactName: {
      type: "string",
      minLength: 1,
    },
    contactEmail: {
      type: "string",
      minLength: 1,
    },
    contactPhoneNumber: {
      type: "string",
      minLength: 1,
    },
    description: {
      type: "string",
    },
  },
  additionalProperties: false,
};

// export const SubmitCardOrderValidation = Joi.object({
//   accountUserId: Joi.string().min(3).max(30).required(),
//   accountName: Joi.string().min(3).max(30).required(),
//   accountPassword: Joi.string().min(3).max(100).required(),
//   accountServer: Joi.string().min(3).max(30).required(),
//   accountCharacterName: Joi.string().min(3).max(100).required(),
//   phoneNumber: Joi.string().min(3).max(30).required(),
// });
