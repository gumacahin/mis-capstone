import { createContext, useContext, ReactNode } from "react";
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useLocalStorage from "use-local-storage";

interface ThemeContextType {
  mode: "light" | "dark" | "system";
  setMode: (mode: "light" | "dark" | "system") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useLocalStorage<"light" | "dark" | "system">(
    "theme",
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
};
