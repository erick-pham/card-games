import { find } from "lodash";

export const PRODUCT_STATUS = {
  NEW: "NEW",
  DELETED: "DELETED",
};
export const ProductStatus = [
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "DELETED",
    label: "Deleted",
  },
];

export const ORDER_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  CANNCEL: "CANNCEL",
};

export const OrderStatus = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "CANNCEL",
    label: "Cannceled",
  },
  {
    value: "SUCCESS",
    label: "Success",
  },
];

export const ProductStatusGetText = (type: string) => {
  let item = find(ProductStatus, (i) => i.value === type);
  if (item) {
    return item.label;
  }
  return "";
};

export const StatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "info";
    case "ACTIVE":
    case "SUCCESS":
      return "success";
    case "DELETED":
    case "CANNCEL":
      return "error";
    case "SELLING":
    case "PENDING":
      return "warning";
    default:
      return "default";
  }
};

export const PRODUCT_ITEM_STATUS = {
  NEW: "NEW",
  SELLING: "SELLING",
  SOLD: "SOLD",
  DELETED: "DELETED",
};

export const ProductItemStatus = [
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "SELLING",
    label: "Selling",
  },
  {
    value: "SOLD",
    label: "Sold",
  },
  {
    value: "DELETED",
    label: "Deleted",
  },
];

export const GetLabelText = (lables: Array<any>, type: string) => {
  let item = find(lables, (i) => i.value === type);
  if (item) {
    return item.label;
  }
  return "";
};

export const Currencies = [
  {
    value: "VND",
    label: "VND",
  },
  {
    value: "USD",
    label: "USD",
  },
];

export const ProductItemTypes = [
  {
    value: "ACCOUNT",
    label: "Account",
  },
  {
    value: "CARD_GAME",
    label: "Card game",
  },
];
