import { useEffect } from "react";
import { useDispatch } from "react-redux";
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
  FormLabel,
} from "@mui/material";

import { ProductItem } from "components/Admin/OrderPage/types";
import { setErrorState, setLoadingState } from "reduxjs/rootSlice";
import {
  PRODUCT_ITEM_STATUS_LABEL,
  PRODUCT_ITEM_TYPES_LABEL,
  PRODUCT_ITEM_TYPES,
  Currencies,
} from "common/constants";
import message from "common/messages";

export const ProductDetailsModal = ({
  openModal,
  handleReloadPage,
  // handleOpen,
  handleClose,
  productEdit,
  selectedProductId,
}: {
  openModal: boolean;
  handleReloadPage: any;
  // handleOpen: any;
  handleClose: any;
  productEdit: ProductItem | undefined | null;
  selectedProductId: string | undefined | null;
}) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset, register } = useForm({
    // resolver: ajvResolver(schema),
  });

  useEffect(() => {
    reset({
      name: productEdit?.name || "",
      type: productEdit?.type || "",
      price: productEdit?.price || null,
      salePrice: productEdit?.salePrice || null,
      salePriceEndDate: productEdit?.salePriceEndDate?.slice(0, 10) || null,
      currency: productEdit?.currency || "",
      description: productEdit?.description || "",
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
    fetch("/api/vendor/product-items", {
      method: productEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        id: productEdit?.id,
        productId: selectedProductId,
      }),
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
    <Dialog
      open={openModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>
        {productEdit ? "Edit Product Details" : "Add Product Details"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add/edit a product item, please enter all fields here.
        </DialogContentText>
        <form autoComplete="off">
          <Controller
            name="type"
            control={control}
            defaultValue={productEdit?.type}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  label="Type"
                  select
                  // onChange={onChange}
                  value={PRODUCT_ITEM_TYPES.ACCOUNT_GAME}
                  error={error ? true : false}
                  helperText={error?.message}
                  disabled={true}
                >
                  {PRODUCT_ITEM_TYPES_LABEL.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            )}
          />
          <Controller
            name="name"
            control={control}
            defaultValue={productEdit?.name}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  {...field}
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
            name="salePrice"
            control={control}
            defaultValue={productEdit?.salePrice}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  {...field}
                  label="Sale Price"
                  type="number"
                  error={error ? true : false}
                  helperText={error?.message}
                  inputProps={{ min: 1000 }}
                />
              </FormControl>
            )}
          />

          <Controller
            name="salePriceEndDate"
            control={control}
            defaultValue={productEdit?.salePriceEndDate}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  {...field}
                  label="Sale Price end date"
                  type="date"
                  error={error ? true : false}
                  helperText={error?.message}
                  inputProps={{
                    min: new Date().toISOString().slice(0, 10),
                  }}
                />
              </FormControl>
            )}
          />

          <Controller
            name="currency"
            control={control}
            defaultValue={productEdit?.currency}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
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
            name="thumbnail"
            control={control}
            defaultValue={productEdit?.thumbnail}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  {...field}
                  label="Thumbnail"
                  error={error ? true : false}
                  helperText={error?.message}
                />
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
                  label="Description"
                  multiline
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
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  label="Status"
                  select
                  onChange={onChange}
                  value={value}
                  error={error ? true : false}
                  helperText={error?.message}
                >
                  {PRODUCT_ITEM_STATUS_LABEL.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            )}
          />

          {/* <Controller
            name="longDescription"
            control={control}
            defaultValue={productEdit?.longDescription}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <FormLabel>Long Description</FormLabel>
                <RichTextEditor
                  initValue={productEdit?.longDescription}
                  handleEditorCallback={onChange}
                ></RichTextEditor>
              </FormControl>
            )}
          /> */}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailsModal;
