export const checkValidSalePrice = (
  salePrice: number,
  salePriceEndDate: string | Date
) => {
  if (!salePriceEndDate || !salePrice) {
    return false;
  }

  if (
    new Date(salePriceEndDate).toISOString().slice(0, 10) <
    new Date().toISOString().slice(0, 10)
  ) {
    return false;
  }

  return true;
};
export default checkValidSalePrice;
