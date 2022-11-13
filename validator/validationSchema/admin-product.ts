import * as Ajv from "ajv";
import { PRODUCT_STATUS } from "../../common/constants";

// must use `minLength: 1` to implement required field
export const ProductValidation: Ajv.JSONSchemaType<{}> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 5,
      nullable: false,
    },
    status: {
      type: "string",
      enum: Object.keys(PRODUCT_STATUS),
      minLength: 1,
    },
    thumbnail: {
      type: "string",
      format: "url",
      minLength: 1,
      nullable: false,
    },
  },
  // required: ["name", "status", "thumbnail"],
  additionalProperties: false,
};
