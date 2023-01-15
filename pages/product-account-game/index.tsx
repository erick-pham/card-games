import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState, useEffect, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import numeral from "numeral";
import {
  Button,
  Container,
  Typography,
  TextField,
  Box,
  Stack,
  Grid,
  TablePagination,
  FormControl,
  SelectChangeEvent,
  CardActions,
  CardContent,
  CardMedia,
  Card,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  styled,
} from "@mui/material";
import UnitOfWork from "database/unit-of-work";
import { setErrorState, setLoadingState } from "app/rootSlice";
import message from "common/messages";
import MainLayout from "components/MainLayout";
import { PRODUCT_STATUS } from "@common/constants";

import { useRouter } from "next/dist/client/router";
import { format as datefnsFormat, formatRelative } from "date-fns";
import { vi } from "date-fns/locale";
import { StyledMainBox } from "components/CustomStyledBox";

type ProductCatType = {
  id: string;
  active: boolean;
  name: string;
};

export type ProductItemType = {
  id: string;
  name: string;
  price: number;
  salePrice: number;
  salePriceEndDate: Date;
  isSale: boolean;
  status: string;
  currency: string;
  thumbnail: string;
  updatedAt: Date;
  description: string;
  longDescription: string;
  referenceNumber: string;
};

type ProductDataType = {
  data: ProductItemType[];
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
    value: "-updatedAt",
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

const DEFAULT_PRICE_RANGE = "0,500000";
const DEFAULT_PRICE_RANGES = [
  {
    value: 0,
    label: "0tr",
  },
  {
    key: "20",
    value: 20,
    label: "0.5tr",
    amount: 500000,
  },
  {
    key: "40",
    value: 40,
    label: "1tr",
    amount: 1000000,
  },
  {
    key: "60",
    value: 60,
    label: "1.5tr",
    amount: 1500000,
  },
  {
    key: "80",
    value: 80,
    label: "2tr",
    amount: 2000000,
  },
  {
    key: "100",
    value: 100,
    label: "Trên 2tr",
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
  productCategories: ProductCatType[];
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  let ProductCats = [
    {
      id: "all",
      active: true,
      name: "Tất cả",
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
    keyword: String(router.query.keyword || ""),
    game: String(router.query.game || "all"),
    orderBy: String(router.query.orderBy || DEFAULT_ORDER_BY),
    priceLow: String(
      router.query.priceLow || DEFAULT_PRICE_RANGE.split(",")[0]
    ),
    priceHigh: String(
      router.query.priceHigh || DEFAULT_PRICE_RANGE.split(",")[1]
    ),
  });

  const [keyword, setKeyword] = useState(String(router.query.keyword || ""));

  const [productData, setProductData] = useState<ProductDataType>();

  useEffect(() => {
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
        price_gte: queryString.priceLow + "",
        price_lte: queryString.priceHigh + "",
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

  const [sliderValue, setSliderValue] = useState<number[]>([0, 20]);

  const handleChangeSlider = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    const minDistance = 20;
    if (!Array.isArray(newValue)) {
      return;
    }
    let results = newValue;
    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        results = [clamped, clamped + minDistance];
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        results = [clamped - minDistance, clamped];
      }
    } else {
      // setSliderValue(newValue as number[]);
    }
    setSliderValue(results);

    const priceLow = DEFAULT_PRICE_RANGES.find(
      (item) => item.key === String(results[0])
    );
    const priceHigh = DEFAULT_PRICE_RANGES.find(
      (item) => item.key === String(results[1])
    );
    const lowAmount = priceLow?.amount ? String(priceLow.amount) : "";
    const highAmount = priceHigh?.amount ? String(priceHigh.amount) : "";
    setQueryString({
      ...queryString,
      priceLow: lowAmount,
      priceHigh: highAmount,
    });
    router.replace({
      query: { ...router.query, priceLow: lowAmount, priceHigh: highAmount },
    });
  };

  const handleEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setQueryString({
        ...queryString,
        keyword: keyword,
      });
      router.replace({
        query: { ...router.query, keyword: keyword },
      });
    }
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <StyledMainBox>
        <Typography variant="subtitle1">Bộ Lọc</Typography>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Stack direction="row" mt={2} spacing={2}>
              {currentCategories.map((cat) => (
                <Button
                  variant="contained"
                  key={cat.id}
                  onClick={() => changeCategory(cat.id)}
                  size={"small"}
                  color={cat.active == true ? "secondary" : "info"}
                  sx={{ padding: 1 }}
                >
                  {cat.name}
                </Button>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <FormControl variant="standard" fullWidth>
              <FormLabel>Khoảng giá</FormLabel>
              <Slider
                step={20}
                getAriaLabel={() => "Price Range"}
                value={sliderValue}
                onChange={handleChangeSlider}
                valueLabelDisplay="off"
                disableSwap
                marks={DEFAULT_PRICE_RANGES}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <FormControl variant="standard" fullWidth>
              <FormLabel>Tìm kiếm</FormLabel>
              <TextField
                variant="standard"
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleEnterSearch}
                value={keyword}
                placeholder={"Tên nhân vật"}
              />
            </FormControl>
          </Grid>
        </Grid>
      </StyledMainBox>

      <StyledMainBox>
        <Box mt={2}>
          <Typography variant="body1">
            {productData?.count || 0} tài khoản trong kho
          </Typography>
          <FormControl variant="outlined" size="small">
            <FormLabel>Sắp xếp theo</FormLabel>
            <RadioGroup
              row
              name="position"
              value={queryString.orderBy}
              onChange={handleChangeSort}
            >
              {DEFAULT_ORDERS.map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item.key}
                  control={<Radio size="small" />}
                  label={item.text}
                  labelPlacement="end"
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        <Grid container spacing={2} mt={2}>
          {productData &&
            productData?.data.map((item, index) => {
              return (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={index}>
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
      </StyledMainBox>
    </Container>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.background.default
      : "#E8E8E8",
  // backgroundColor: "rgba(0, 0, 0, 0.40)",
}));

const RecipeReviewCard = ({ product }: { product: ProductItemType }) => {
  return (
    <StyledCard>
      <Link href={`/product-account-game/${product.id}/details`}>
        <CardMedia
          component="img"
          height="194"
          image={product.thumbnail}
          alt="alt"
        />
      </Link>

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
          {product
            ? formatRelative(new Date(product.updatedAt), new Date(), {
                locale: vi,
              })
            : ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
      </CardContent>

      <CardContent sx={{ p: 1 }}>
        {product.isSale ? (
          <Box>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography
                variant="h6"
                color={"text.primaryRed"}
                style={{ fontWeight: 800 }}
              >
                {numeral(product.salePrice).format("0,0[.]00đ") +
                  " " +
                  product.currency}
              </Typography>
              <Typography variant="h6" color={"text.primaryRed"}>
                {numeral(
                  (product.salePrice - product.price) / product.price
                ).format("%")}
              </Typography>
              <Typography
                variant="h6"
                color={"text.primary"}
                style={{ textDecoration: "line-through", fontStyle: "normal" }}
              >
                {numeral(product.price).format("0,0[.]00đ") +
                  " " +
                  product.currency}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              style={{
                fontStyle: "italic",
              }}
            >
              KM đến{" "}
              {product
                ? datefnsFormat(
                    new Date(product.salePriceEndDate),
                    "dd-MM-yyyy"
                  )
                : ""}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" color={"text.primary"}>
              {numeral(product.price).format("0,0[.]00đ") +
                " " +
                product.currency}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions>
        <Link href={`/product-account-game/${product.id}/details`}>
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
    </StyledCard>
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
