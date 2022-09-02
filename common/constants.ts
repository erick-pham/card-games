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
    value: "DELETED",
    label: "Deleted",
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
      return "success";
    case "DELETED":
      return "error";
    case "SELLING":
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

export const ProductItemStatusGetText = (type: string) => {
  let item = find(ProductItemStatus, (i) => i.value === type);
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

export const ProductTypes = [
  {
    value: "ACCOUNT",
    label: "Account",
  },
  {
    value: "CARD_GAME",
    label: "Card game",
  },
];
