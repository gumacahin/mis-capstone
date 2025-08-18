import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ThemeContext from "@shared/contexts/themeContext";
import { ReactNode } from "react";
import useLocalStorage from "use-local-storage";

export default function ThemeContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setMode] = useLocalStorage<"light" | "dark" | "system">(
    "upoutodo.theme",
    "system",
  );
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const themeMode =
    mode === "system" ? (prefersDarkMode ? "dark" : "light") : mode;

  const theme: Theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
