export type SessionUser = {
  name?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  isAdmin?: boolean;
  isVendor?: boolean;
};

export const getSessionUserInfo = (session: any) => {
  if (!session) {
    return null;
  }
  let userInfo: SessionUser = {
    ...session?.user,
    firstName: session?.user?.name as string,
    lastName: session?.user?.name as string,
    phoneNumber: session?.userPhoneNumber as string,
    isAdmin: session?.userRole === "Admin" ? true : false,
    isVendor: session?.userRole === "Vendor" ? true : false,
  };

  return userInfo;
};
