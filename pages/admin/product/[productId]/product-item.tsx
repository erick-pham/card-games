import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Modal } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import { Controller, useForm } from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { useDispatch } from "react-redux";
import numeral from "numeral";
import NavBar from "../../../components/NavBar";
import styles from "../../../../styles/Home.module.css";
import { Product } from "../../../../interfaces/entity/product";
import { setErrorState } from "../../../../app/rootSlice";
import { ProductItem } from "../../../../interfaces/entity/product_item";
import {
  ProductItemStatus,
  ProductItemStatusGetText,
  Currencies,
  StatusColor,
} from "../../../../common/constants";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  // boxShadow: 24,
  p: 4,
};

const schema = {
  type: "object",
  required: ["name", "currency", "image", "status", "description", "price"],
  properties: {
    name: {
      type: "string",
      minLength: 5,
      maxLength: 256,
      // errorMessage: { minLength: "Name field is required" },
    },
    // price: {
    //   type: "number",
    //   multipleOf: 1000,
    // },
    currency: {
      type: "string",
      minLength: 3,
      maxLength: 3,
    },
    description: {
      type: "string",
      minLength: 3,
      maxLength: 256,
    },
    image: {
      type: "string",
      // pattern: "^(https?|wss?|ftp)://",
    },
    status: {
      type: "string",
      enum: ProductItemStatus.map((i) => i.value),
      // pattern: "^(https?|wss?|ftp)://",
    },
  },
  additionalProperties: true,
};

type EditProductModalType = {
  handleOpen: (id: string) => void;
  open: boolean;
  handleClose: () => void;
  handleDelete: (productId: string) => void;
  productItems: ProductItem;
};

function CustomizedTables({
  productItems,
  handleOpen,
  handleDelete,
}: {
  productItems: Array<ProductItem> | [];
  handleOpen: EditProductModalType["handleOpen"];
  handleDelete: EditProductModalType["handleDelete"];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Description</StyledTableCell>
            <StyledTableCell align="right">Thumbnail</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productItems &&
            productItems.map((productItem) => (
              <StyledTableRow key={productItem.id}>
                <StyledTableCell component="th" scope="row">
                  {productItem.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {numeral(productItem.price).format("0,0") +
                    " " +
                    productItem.currency}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Chip
                    label={ProductItemStatusGetText(productItem.status)}
                    color={StatusColor(productItem.status)}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  {productItem.description}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <CardMedia
                    component="img"
                    height="150"
                    image={productItem.image}
                    alt="alt"
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ margin: 4 }}
                    onClick={() => handleOpen(productItem.id)}
                  >
                    Edit
                  </Button>
                  {/* <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(productItem.id)}
                  >
                    Delete
                  </Button> */}
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AdminProductItem() {
  const { control, handleSubmit, reset, register } = useForm({
    resolver: ajvResolver(schema),
  });

  const router = useRouter();
  const productId = router.query["productId"];
  console.log("productId", productId);
  const dispatch = useDispatch();
  const [reloadPage, setReloadPage] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [productEdit, setProductEdit] = useState<
    ProductItem | undefined | null
  >();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/product?productId=${productId}`)
      .then((response) => response.json())
      .then((x) => {
        if (x && x[0]) {
          setCurrentProduct(x[0]);
        }
      });
  }, [reloadPage, productId]);

  const handleOpen = (productId: string) => {
    setProductEdit(null);
    let editItem;
    if (productId) {
      editItem = currentProduct?.productItems?.find((i) => i.id === productId);
      setProductEdit(editItem);
    }
    reset();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (productId: string) => {
    fetch("/api/product-item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: productId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error === true) {
          dispatch(
            setErrorState({
              message: data.message,
              values: "",
              severity: "error",
            })
          );
        } else {
          setReloadPage(!reloadPage);
        }
      });
  };

  const onSubmit = (data: object) => {
    console.log("data", data);
    fetch("/api/product-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        id: productEdit?.id,
        productId: productId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error === true) {
          console.log("datadata", data);
          dispatch(
            setErrorState({
              message: data.message,
              values: "",
              severity: "error",
            })
          );
        } else {
          handleClose();
          setReloadPage(!reloadPage);
        }
      });
  };

  return (
    <div>
      <Modal dimmer={true} open={open} onClose={handleClose}>
        <Modal.Header> {productEdit ? "Edit" : "Add"}</Modal.Header>
        <Modal.Content>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Controller
              name="name"
              control={control}
              defaultValue={productEdit?.name}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <TextField
                    {...field}
                    id="outlined-multiline-flexible"
                    label="Name"
                    error={error ? true : false}
                    helperText={error?.message}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="price"
              control={control}
              defaultValue={productEdit?.price}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <TextField
                    {...field}
                    id="outlined-multiline-flexible"
                    label="Price"
                    type="number"
                    error={error ? true : false}
                    helperText={error?.message}
                    inputProps={{ min: 1000 }}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="currency"
              control={control}
              defaultValue={productEdit?.currency}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Currency"
                    select
                    onChange={onChange}
                    value={value}
                    error={error ? true : false}
                    helperText={error?.message}
                  >
                    {Currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              )}
            />

            <Controller
              name="description"
              control={control}
              defaultValue={productEdit?.description}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <TextField
                    {...field}
                    id="outlined-multiline-flexible"
                    label="Description"
                    error={error ? true : false}
                    helperText={error?.message}
                  />
                </FormControl>
              )}
            />
            <Controller
              name="image"
              control={control}
              defaultValue={productEdit?.image}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <TextField
                    {...field}
                    id="outlined-multiline-flexible"
                    label="Image"
                    error={error ? true : false}
                    helperText={error?.message}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="status"
              control={control}
              defaultValue={productEdit?.status}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Status"
                    select
                    onChange={onChange}
                    value={value}
                    error={error ? true : false}
                    helperText={error?.message}
                  >
                    {ProductItemStatus.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              )}
            />

            <Button
              variant="contained"
              color="primary"
              style={{ margin: 4 }}
              type="submit"
            >
              Save
            </Button>
          </form>
        </Modal.Content>
      </Modal>
      <div className={styles.container}>
        <Head>
          <title>Admin - Product Management</title>
          <meta
            name="description"
            content="Admin - Product Management by Erick.Pham"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container maxWidth={false}>
          <NavBar></NavBar>
        </Container>
        <Container maxWidth={false} style={{ marginTop: 10 }}>
          <Box style={{ backgroundColor: "#fff", padding: 8 }}>
            <Typography variant="h5">Product Item Management</Typography>
            <Typography variant="h5">{currentProduct?.name}</Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleOpen("")}
            >
              Add
            </Button>
          </Box>
          <CustomizedTables
            productItems={currentProduct?.productItems || []}
            handleOpen={handleOpen}
            handleDelete={handleDelete}
          ></CustomizedTables>
        </Container>
        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles.logo}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default AdminProductItem;
