"use client"
import { useContext, useState, createContext } from "react";
import { CircularProgress, Backdrop } from "@mui/material";

type LoadingContextType = {
  loading: boolean;
  setLoading: (b: boolean) => void;
};

const defaultContext: LoadingContextType = {
  loading: false,
  setLoading: () => {},
};

const LoadingContext = createContext(defaultContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider
      value={{
        loading: loading,
        setLoading: setLoading,
      }}
    >
      {children}
      <Backdrop open={loading} sx={{ color: "#fff", zindex: (theme) => theme.zIndex.tooltip + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};