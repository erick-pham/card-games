export const checkIsAdmin = (session: any) => {
  const flag = session?.userRole === "Admin" ? true : false;
  return flag;
};

export const checkIsVendor = (session: any) => {
  const flag = session?.userRole === "Vendor" ? true : false;
  return flag;
};
export default checkIsAdmin;
