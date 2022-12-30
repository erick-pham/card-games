import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import numeral from "numeral";
import {
  Button,
  Container,
  Typography,
  styled,
  Box,
  Stack,
  Grid,
  TablePagination,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  CardActions,
  CardContent,
  CardMedia,
  Card,
} from "@mui/material";
import { ProductItem } from "database/entity/product_item";
import UnitOfWork from "database/unit-of-work";
import { setErrorState, setLoadingState } from "app/rootSlice";
import message from "common/messages";
import MainLayout from "pages/components/MainLayout";
import { PRODUCT_STATUS } from "@common/constants";

import { Product } from "@database/entity/product";
import { useRouter } from "next/dist/client/router";
import { format as datefnsFormat } from "date-fns";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: 5,
  padding: 18,
}));

type ProductCatType = {
  id: string;
  active: boolean;
  name: string;
};

type ProductDataType = {
  data: ProductItem[];
  limit: number;
  count: number;
  currentPage: number;
  rowsPerPageOptions: number[];
  lastPage: number;
  nextPage: number;
  prevPage: number;

  // handleLimitChange(event: any): void,
  // handlePageChange(event: any, newPage: any): void
};

const DEFAULT_ORDER_BY = "sort_0";
const DEFAULT_ORDERS = [
  {
    key: "sort_0",
    value: "-createdAt",
    text: "Mới nhất",
  },
  {
    key: "sort_1",
    value: "price",
    text: "Giá tăng dần",
  },
  {
    key: "sort_2",
    value: "-price",
    text: "Giá giảm dần",
  },
];

const DEFAULT_PRICE_RANGE = "price_range_0";
const DEFAULT_PRICE_RANGES = [
  {
    key: "price_range_0",
    value: [],
    text: "Tất cả",
  },
  {
    key: "price_range_1",
    value: [0, 300000],
    text: "0k - 300k",
  },
  {
    key: "price_range_2",
    value: [301000, 500000],
    text: "301k - 500k",
  },
  {
    key: "price_range_3",
    value: [501000, 1000000],
    text: "501k - 1000k",
  },
  {
    key: "price_range_4",
    value: [1001000, 3000000],
    text: "1001k - 3000k",
  },
  {
    key: "price_range_5",
    value: [3001000],
    text: "Trên 3000k",
  },
];

const DEFAULT_PANIGATION = {
  limit: 10,
  page: 1,
  rowPerPage: [10, 20, 50, 100],
};

const AccountGamePage = ({
  productCategories,
}: {
  productCategories: Product[];
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  let ProductCats = [
    {
      id: "all",
      active: true,
      name: "All",
    },
  ];
  productCategories?.map((item) =>
    ProductCats.push({
      id: item.id,
      active: false,
      name: item.name,
    })
  );

  const [currentCategories, setCurrentCategories] =
    useState<ProductCatType[]>(ProductCats);
  const [queryString, setQueryString] = useState({
    limit: Number(router.query.limit || DEFAULT_PANIGATION.limit),
    page: Number(router.query.page || DEFAULT_PANIGATION.page),
    keyword: "",
    game: String(router.query.game || "all"),
    orderBy: String(router.query.orderBy || DEFAULT_ORDER_BY),
    priceRange: String(router.query.priceRange || DEFAULT_PRICE_RANGE),
  });

  const [productData, setProductData] = useState<ProductDataType>();

  useEffect(() => {
    const prices = DEFAULT_PRICE_RANGES.find(
      (item) => item.key === queryString.priceRange
    );
    const orders = DEFAULT_ORDERS.find(
      (item) => item.key === queryString.orderBy
    );
    const qs =
      "?" +
      new URLSearchParams({
        limit: queryString.limit + "",
        page: queryString.page + "",
        keyword: queryString.keyword + "",
        game: queryString.game + "",
        price_gte: (prices?.value[0] ? prices?.value[0] : "") + "",
        price_lte: (prices?.value[1] ? prices?.value[1] : "") + "",
        sort: (orders?.value ? orders?.value : "") + "",
      }).toString();

    dispatch(
      setLoadingState({
        loading: true,
        loadingMessage: message.appAPILoading,
      })
    );
    fetch("/api/public/account-games" + qs)
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
          setProductData(data);
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
  }, [dispatch, queryString]);

  const changeCategory = (cat: string) => {
    currentCategories.forEach((item) => {
      if (item.id === cat) {
        item.active = !item.active;

        currentCategories.forEach((item) => {
          if (item.id === "all" && cat !== "all") {
            item.active = false;
          }
        });
      }
    });
    setCurrentCategories(currentCategories);
    const ids = currentCategories
      .filter((i) => i.active === true)
      .map((i) => i.id);
    setQueryString({
      ...queryString,
      game: ids.join(","),
    });
    router.replace({
      query: { ...router.query, game: ids.join(",") },
    });
  };

  const handleLimitChange = (event: any) => {
    setQueryString({
      ...queryString,
      limit: event.target.value,
      page: 1,
    });
    router.replace({
      query: { ...router.query, page: 1, limit: event.target.value },
    });
  };

  const handlePageChange = (event: any, newPage: any) => {
    let page = productData?.currentPage || 1;
    if (newPage === page) {
      page += 1;
    } else if (newPage < page) {
      page = productData?.prevPage || 1;
    }

    setQueryString({
      ...queryString,
      page,
    });
    router.replace({
      query: { ...router.query, page: page },
    });
  };

  const handleChangeSort = (event: SelectChangeEvent) => {
    setQueryString({
      ...queryString,
      orderBy: event.target.value,
    });
    router.replace({
      query: { ...router.query, orderBy: event.target.value },
    });
  };

  const handleChangePriceRange = (event: SelectChangeEvent) => {
    setQueryString({
      ...queryString,
      priceRange: event.target.value,
    });
    router.replace({
      query: { ...router.query, priceRange: event.target.value },
    });
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <StyledBox>
        <Typography variant="subtitle1">Games</Typography>
        <Stack direction="row" spacing={2}>
          {currentCategories.map((cat) => (
            <Button
              variant="contained"
              key={cat.id}
              onClick={() => changeCategory(cat.id)}
              size={"small"}
              color={cat.active == true ? "secondary" : "inherit"}
            >
              {cat.name}
            </Button>
          ))}
        </Stack>

        <Stack direction="row" mt={2} spacing={2}>
          <FormControl variant="standard" size="small" sx={{ width: 150 }}>
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
              value={queryString.orderBy}
              label="sort"
              onChange={handleChangeSort}
            >
              {DEFAULT_ORDERS.map((item, index) => (
                <MenuItem key={index} value={item.key}>
                  {item.text}
                </MenuItem>
              ))}
              {/* <MenuItem value={"price_asc"}>Giá tăng dần</MenuItem>
              <MenuItem value={"price_desc"}>Giá giảm dần</MenuItem>
              <MenuItem value={"created_at_desc"}>Mới nhất</MenuItem> */}
            </Select>
          </FormControl>
          <FormControl variant="standard" size="small" sx={{ width: 150 }}>
            <InputLabel>Khoản giá</InputLabel>
            <Select
              value={queryString.priceRange}
              label="priceRange"
              onChange={handleChangePriceRange}
            >
              {DEFAULT_PRICE_RANGES.map((item, index) => (
                <MenuItem key={index} value={item.key}>
                  {item.text}
                </MenuItem>
              ))}
              {/* <MenuItem value={"price_range_1"}>0k - 300k</MenuItem>
              <MenuItem value={"price_range_2"}>301k - 500k</MenuItem>
              <MenuItem value={"price_range_3"}>501k - 1000k</MenuItem>
              <MenuItem value={"price_range_4"}>1001k - 3000k</MenuItem>
              <MenuItem value={"price_range_5"}>Trên 3000k</MenuItem> */}
            </Select>
          </FormControl>
        </Stack>

        <Box mt={2}>
          <Typography variant="body1">
            {productData?.count || 0} tài khoản trong kho
          </Typography>
        </Box>

        <Grid container spacing={2} mt={2}>
          {productData &&
            productData?.data.map((item, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                  <RecipeReviewCard product={item}></RecipeReviewCard>
                </Grid>
              );
            })}
        </Grid>
        <TablePagination
          component="div"
          count={productData?.count || 0}
          // showFirstButton
          // showLastButton
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={(productData?.currentPage || 1) - 1}
          rowsPerPage={productData?.limit || 0}
          labelRowsPerPage={"Số lượng mỗi trang"}
          rowsPerPageOptions={DEFAULT_PANIGATION.rowPerPage}
        ></TablePagination>
      </StyledBox>
    </Container>
  );
};

const RecipeReviewCard = ({ product }: { product: ProductItem }) => {
  return (
    <Card sx={{ bgcolor: "#E8E8E8" }}>
      <CardMedia
        component="img"
        height="194"
        image={product.thumbnail}
        alt="alt"
      />
      <CardContent sx={{ height: 150, p: 2 }}>
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography
          variant="caption"
          style={{
            fontStyle: "italic",
          }}
        >
          {product ? datefnsFormat(new Date(product.createdAt), "Pp") : ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
      </CardContent>

      <CardContent sx={{ p: 1 }}>
        <Typography variant="h6">
          {numeral(product.price).format("0,0[.]00đ") + " " + product.currency}
        </Typography>
      </CardContent>

      <CardActions>
        <Link href={`/account-game/${product.id}/checkout`}>
          <Button
            variant="contained"
            size="small"
            // color="inherit"
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
              borderRadius: "0px",
              margin: 1,
              float: "right",
            }}
          >
            Mua ngay
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  try {
    // const { params, req, res, query } = context;
    let productData = null;

    const uow = new UnitOfWork();
    await uow.initialize();
    const data = await uow.ProuductRepository.find({
      where: {
        status: PRODUCT_STATUS.ACTIVE,
      },
    });

    productData = JSON.parse(JSON.stringify(data));
    return {
      props: { productCategories: productData },
    };
  } catch (error) {
    return {
      props: { internalError: true, statusCode: 500 },
    };
  }
};

AccountGamePage.getLayout = (page: any) => (
  <MainLayout pageTitle="Mua tài khoản games">{page}</MainLayout>
);
export default AccountGamePage;
