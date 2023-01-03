export type User = {
  id: string;
  email: string;
  name: string;
};

export type ProductItem = {
  id: string;
  name: string;
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

export type OrderAPIReponse = {
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
  orders: OrderAPIReponse | undefined | null;
  handleLimitChange: (event: any) => void;
  handlePageChange: (event: any, newPage: any) => void;
  handleClickAction: (orderId: string) => void;
};
