import { useContext } from "react";

import ToolbarContext from "../contexts/ToolbarContext";

export default function useToolbarContext() {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbarContext must be used within a ToolbarProvider");
  }
  return context;
}
