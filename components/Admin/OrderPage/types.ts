export type User = {
  id: string;
  email: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
};

export type ProductItem = {
  id: string;
  type: string;
  currency: string;
  name: string;
  status: string;
  price: number;
  description: string;
  longDescription: string;
  thumbnail: string;
};

export type OrderDetails = {
  id: string;
  accountUserId: string;
  accountName: string;
  accountPassword: string;
  accountServer: string;
  accountCharacterName: string;
  description: string;
};

export type Order = {
  id: string;
  referenceNumber: string;
  amount: string;
  description: string;
  contactName: string;
  contactPhoneNumber: string;
  contactEmail: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  productItem: ProductItem;
  orderDetails: OrderDetails;
};

export type OrderListAPIReponse = {
  data: Order[];
  count: number;
  limit: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
  lastPage: number;
};

export type OrderDetailsModalProps = {
  openModal: boolean;
  orderDataModal: Order | undefined;
  handleOpen: () => void;
  handleClose: () => void;
};

export type OrderListResultsProps = {
  orders: OrderListAPIReponse | undefined | null;
  handleLimitChange: (event: any) => void;
  handlePageChange: (event: any, newPage: any) => void;
  handleClickAction: (orderId: string) => void;
  handleClickCellStatus: (orderId: string, status: string) => void;
};

export type ProductItemListAPIReponse = {
  data: ProductItem[];
  count: number;
  limit: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
  lastPage: number;
};
