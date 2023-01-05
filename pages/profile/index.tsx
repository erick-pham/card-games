import Router, { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import { unstable_getServerSession } from "next-auth/next";
import { FindOptionsWhere } from "typeorm";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
  Grid,
  Avatar,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormHelperText,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import { ajvResolver } from "validator/ajvResolver";
import { SubmitCardOrderValidation } from "validator/validationSchema/client-orders";

import { setErrorState, setLoadingState } from "app/rootSlice";
import message from "common/messages";
import { Controller, useForm } from "react-hook-form";
import UnitOfWork from "database/unit-of-work";
import { UserEntity } from "database/entity/entities";
import { authOptions } from "pages/api/auth/[...nextauth]";
import MainLayout from "components/MainLayout";
import { StyledMainBox } from "components/CustomStyledBox";
import { GENDERS } from "common/constants";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps<
  ProfilePageProps | any
> = async (context) => {
  try {
    const { params, req, res } = context;
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );

    if (!session) {
      return {
        notFound: true,
      };
    } else {
      const uow = new UnitOfWork();
      await uow.initialize();

      const data = (await uow.UserRepository.findOne({
        select: [
          "id",
          "gender",
          "firstName",
          "lastName",
          "image",
          "name",
          "email",
          "phoneNumber",
          "createdAt",
        ],
        where: {
          id: session?.userId as string,
        },
      })) as FindOptionsWhere<UserEntity>;

      const userProfile = JSON.parse(JSON.stringify(data));
      return {
        props: { userProfile },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      props: { internalError: true, statusCode: 500 },
    };
  }
};

type UserProfile = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image: string;
  gender: string;
  address: string;
};

type ProfilePageProps = {
  internalError?: boolean;
  statusCode?: number;
  userProfile: UserProfile;
};

const ProfilePage = ({
  internalError,
  statusCode,
  userProfile,
}: ProfilePageProps) => {
  const dispatch = useDispatch();
  let defaultValues = {
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phoneNumber: userProfile?.phoneNumber || "",
  };

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<UserProfile>({
    // resolver: ajvResolver(SubmitCardOrderValidation),
    defaultValues,
  });

  const [values, setValues] = useState({
    id: userProfile?.id || "",
    email: userProfile?.email,
    image: userProfile?.image || "",
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    phoneNumber: userProfile?.phoneNumber || "",
    name: userProfile?.name || "",
    gender: userProfile?.gender || "",
    address: userProfile?.address || "",
  });

  const handleOnSave = () => {
    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );

    const payload = values as UserProfile;

    fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
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

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  if (internalError && statusCode) {
    return <ErrorPage statusCode={statusCode} />;
  }

  return (
    <Container style={{ marginTop: 10 }}>
      <StyledMainBox>
        {" "}
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <AccountProfile userProfile={values} />
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            <AccountProfileDetails
              values={values}
              handleChange={handleChange}
              handleOnSave={handleOnSave}
            />
          </Grid>
        </Grid>
      </StyledMainBox>
    </Container>
  );
};

const AccountProfile = ({ userProfile }: { userProfile: UserProfile }) => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Avatar
          src={userProfile.image}
          sx={{
            height: 64,
            mb: 2,
            width: 64,
          }}
        />
        <Typography color="textPrimary" gutterBottom variant="h5">
          {userProfile.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {/* {`${userProfile.city} ${userProfile.country}`} */}
          {userProfile.email}
        </Typography>
        {/* <Typography color="textSecondary" variant="body2">
          {userProfile.timezone}
        </Typography> */}
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button color="primary" fullWidth variant="text">
        Upload picture
      </Button>
    </CardActions>
  </Card>
);

const AccountProfileDetails = ({
  values,
  handleChange,
  handleOnSave,
}: {
  values: UserProfile;
  handleChange: (event: any) => void;
  handleOnSave: () => void;
}) => {
  return (
    <form autoComplete="off">
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Gender"
                name="gender"
                onChange={handleChange}
                required
                select
                value={values.gender}
                variant="outlined"
              >
                {GENDERS?.map((option) =>
                  !option.value ? (
                    <MenuItem key={option.value} value="">
                      <em>None</em>
                    </MenuItem>
                  ) : (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                // helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                required
                onChange={handleChange}
                value={values.phoneNumber}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                onChange={handleChange}
                required
                value={values.address}
                variant="outlined"
              />
            </Grid>
            {/* <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Select State"
                name="state"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.state}
                variant="outlined"
              >
                {states.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid> */}
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" onClick={handleOnSave}>
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

ProfilePage.getLayout = (page: any) => (
  <MainLayout pageTitle="Hồ sơ cá nhân">{page}</MainLayout>
);
export default ProfilePage;
