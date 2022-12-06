import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { ajvResolver } from "../../../../validator/ajvResolver";
import * as AdminProductValidation from "../../../../validator/validationSchema/admin-product";

import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Product } from "database/entity/product";
import { setErrorState, setLoadingState } from "../../../../app/rootSlice";
import { PRODUCT_STATUS_LABEL } from "common/constants";
import message from "common/messages";

const FormHelperTextProps = {
  sx: {
    "&:first-letter": { textTransform: "capitalize" },
  },
};

export const ProductModal = ({
  openModal,
  handleReloadPage,
  handleOpen,
  handleClose,
  productEdit,
}: {
  openModal: boolean;
  handleReloadPage: any;
  handleOpen: any;
  handleClose: any;
  productEdit: Product | undefined | null;
}) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset, register } = useForm({
    resolver: ajvResolver(AdminProductValidation.ProductValidation),
  });

  useEffect(() => {
    reset({
      name: productEdit?.name || "",
      thumbnail: productEdit?.thumbnail || "",
      status: productEdit?.status || "",
    });
  }, [productEdit, reset]);

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
          handleReloadPage();
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

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle>
        {productEdit ? "Edit Product Details" : "Add Product Details"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add/edit a product item, please enter all fields here.
        </DialogContentText>
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
                  FormHelperTextProps={FormHelperTextProps}
                />
              </FormControl>
            )}
          />
          <Controller
            name="thumbnail"
            control={control}
            defaultValue={productEdit?.name}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  {...field}
                  id="outlined-multiline-flexible"
                  label="Thumbnail"
                  error={error ? true : false}
                  helperText={error?.message}
                  FormHelperTextProps={FormHelperTextProps}
                />
              </FormControl>
            )}
          />
          <Controller
            name="status"
            control={control}
            defaultValue={productEdit?.status}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  id="outlined-multiline-flexible"
                  label="Product Status"
                  select
                  onChange={onChange}
                  value={value}
                  error={error ? true : false}
                  helperText={error?.message}
                  FormHelperTextProps={FormHelperTextProps}
                >
                  {PRODUCT_STATUS_LABEL.map((option) => (
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
