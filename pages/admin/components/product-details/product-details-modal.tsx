import { useState, useEffect } from "react";
import { Modal } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { ProductItem } from "../../../../interfaces/entity/product_item";
import { setErrorState, setLoadingState } from "../../../../app/rootSlice";
import {
  ProductItemStatus,
  ProductItemTypes,
  Currencies,
} from "../../../../common/constants";
import message from "../../../../common/messages";

export const ProductDetailsModal = ({
  openModal,
  handleReloadPage,
  handleOpen,
  handleClose,
  productEdit,
  selectedProductId,
}: {
  openModal: boolean;
  handleReloadPage: any;
  handleOpen: any;
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
      price: productEdit?.price || "",
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
    fetch("/api/product-item", {
      method: "POST",
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
    <Modal
      dimmer={true}
      open={openModal}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <Modal.Header> {productEdit ? "Edit" : "Add"}</Modal.Header>
      <Modal.Content>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Controller
            name="type"
            control={control}
            defaultValue={productEdit?.type}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  id="outlined-multiline-flexible"
                  label="Type"
                  select
                  onChange={onChange}
                  value={value}
                  error={error ? true : false}
                  helperText={error?.message}
                >
                  {ProductItemTypes.map((option) => (
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
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
            name="thumbnail"
            control={control}
            defaultValue={productEdit?.thumbnail}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  {...field}
                  id="outlined-multiline-flexible"
                  label="Thumbnail"
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
  );
};

export default ProductDetailsModal;
