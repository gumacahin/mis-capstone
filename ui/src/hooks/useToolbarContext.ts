import { useContext } from "react";

import ToolbarContext, {
  type ToolbarContextType,
} from "../contexts/toolbarContext";

export default function useToolbarContext(): ToolbarContextType {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbarContext must be used within a ToolbarProvider");
  }
  return context;
}
