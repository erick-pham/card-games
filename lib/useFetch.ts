import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setErrorState, setLoadingState } from "reduxjs/rootSlice";
import message from "common/messages";

export type TApiResponse = {
  status: Number;
  statusText: String;
  data: any;
  error: any;
  loading: Boolean;
};

export const useApiGet = (url: string): TApiResponse => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState<Number>(0);
  const [statusText, setStatusText] = useState<String>("");
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getAPIData = async () => {
    setLoading(true);
    try {
      dispatch(
        setLoadingState({
          loading: true,
          loadingMessage: message.appAPILoading,
        })
      );

      const apiResponse = await fetch(url);
      const json = await apiResponse.json();
      setStatus(apiResponse.status);
      setStatusText(apiResponse.statusText);
      setData(json);
    } catch (error: any) {
      dispatch(
        setErrorState({
          message: error?.message,
          values: "",
          severity: "error",
        })
      );
      setError(error);
    } finally {
      setLoading(false);
      dispatch(
        setLoadingState({
          loading: false,
          loadingMessage: null,
        })
      );
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

  return { status, statusText, data, error, loading };
};
