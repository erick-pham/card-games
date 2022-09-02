import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
import Chip from "@mui/material/Chip";
import { Controller, useForm } from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { useDispatch } from "react-redux";
import NavBar from "../../components/NavBar";
import styles from "../../../styles/Home.module.css";
import { Product } from "../../../interfaces/entity/product";
import { setErrorState, setLoadingState } from "../../../app/rootSlice";
import {
  ProductStatus,
  ProductStatusGetText,
  StatusColor,
} from "../../../common/constants";
import message from "../../../common/messages";
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

const schema = {
  type: "object",
  required: ["name", "status"],
  properties: {
    name: {
      type: "string",
      minLength: 5,
      maxLength: 256,
      // errorMessage: { minLength: "Name field is required" },
    },
    status: {
      type: "string",
      enum: ProductStatus.map((i) => i.value),
      // errorMessage: { enum: "Must be equal to one of the allowed values" },
    },
  },
  additionalProperties: false,
};

type EditProductModalType = {
  handleOpen: (id: string) => void;
  open: boolean;
  handleClose: () => void;
  handleDelete: (productId: string) => void;
  product: Product;
};

function CustomizedTables({
  products,
  handleOpen,
}: // handleDelete,
{
  products: Array<Product>;
  handleOpen: EditProductModalType["handleOpen"];
  // handleDelete: EditProductModalType["handleDelete"];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Last Update</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products &&
            products.map((product) => (
              <StyledTableRow key={product.id}>
                <StyledTableCell component="th" scope="row">
                  {product.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Chip
                    label={ProductStatusGetText(product.status)}
                    color={StatusColor(product.status)}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  {new Date(product?.createdAt || new Date()).toLocaleString()}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Link href={`/admin/product/${product.id}/product-item`}>
                    <Button variant="contained" color="info">
                      View Item ({product.productItems?.length})
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ margin: 4 }}
                    onClick={() => handleOpen(product.id)}
                  >
                    Edit
                  </Button>
                  {/* <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(product.id)}
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

function AdminProduct() {
  const dispatch = useDispatch();
  const [reloadPage, setReloadPage] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productEdit, setProductEdit] = useState<Product | undefined | null>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/product")
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
          setProducts(data);
        }
      })
      .finally(() => {
        dispatch(
          setLoadingState({
            loading: false,
            loadingMessage: null,
          })
        );
      });
  }, [dispatch, reloadPage]);

  const handleOpen = (productId: string) => {
    setProductEdit(null);
    let editItem;
    if (productId) {
      editItem = products.find((i) => i.id === productId);
      setProductEdit(editItem);
    }
    reset({
      name: editItem ? editItem.name : "",
      status: editItem ? editItem.status : "",
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // const handleDelete = (productId: string) => {
  //   fetch("/api/product", {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ id: productId }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.error === true) {
  //         dispatch(
  //           setErrorState({
  //             message: data.message,
  //             values: "",
  //             severity: "error",
  //           })
  //         );
  //       } else {
  //         setReloadPage(!reloadPage);
  //       }
  //     });
  // };

  const onSubmit = (data: object) => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, id: productEdit?.id }),
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
          handleClose();
          setReloadPage(!reloadPage);
        }
      })
      .finally(() => {
        dispatch(
          setLoadingState({
            loading: false,
            loadingMessage: null,
          })
        );
      });
  };

  const { control, handleSubmit, reset, register } = useForm({
    resolver: ajvResolver(schema),
  });

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
              name="status"
              control={control}
              defaultValue={productEdit?.type}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Product Status"
                    select
                    onChange={onChange}
                    value={value}
                    error={error ? true : false}
                    helperText={error?.message}
                  >
                    {ProductStatus.map((option) => (
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
            <Typography variant="h5">Product Management</Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleOpen("")}
            >
              Add
            </Button>
          </Box>
          <CustomizedTables
            products={products}
            handleOpen={handleOpen}
            // handleDelete={handleDelete}
          ></CustomizedTables>
        </Container>

        {/* <footer className={styles.footer}>
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
        </footer> */}
      </div>
    </div>
  );
}

export default AdminProduct;
