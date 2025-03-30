import { createContext } from "react";

interface ThemeContextType {
  mode: "light" | "dark" | "system";
  setMode: (mode: "light" | "dark" | "system") => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export default ThemeContext;
