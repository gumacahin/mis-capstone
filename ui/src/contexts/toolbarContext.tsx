import { createContext, Dispatch, ReactNode, SetStateAction } from "react";

interface ToolbarContextType {
  toolbarItems: ReactNode;
  setToolbarItems: Dispatch<SetStateAction<ReactNode>>;
}

const ToolbarContext = createContext<ToolbarContextType | null>(null);

export default ToolbarContext;
