"use client"
import { createTheme, ThemeProvider } from "@mui/material";
import { LoadingProvider } from "@/hooks/useLoading";

const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        {children}
      </LoadingProvider>
    </ThemeProvider>
  );
}