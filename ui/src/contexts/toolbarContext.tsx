import { createContext, Dispatch, ReactNode, SetStateAction } from "react";

export interface ToolbarContextType {
  toolbarIcons: ReactNode;
  toolbarAdditionalIcons: ReactNode;
  toolbarTitle: ReactNode;
  toolbarBottom: ReactNode;
  setToolbarIcons: Dispatch<SetStateAction<ReactNode>>;
  setToolbarTitle: Dispatch<SetStateAction<ReactNode>>;
  setToolbarBottom: Dispatch<SetStateAction<ReactNode>>;
  setToolbarAdditionalIcons: Dispatch<SetStateAction<ReactNode>>;
}

const ToolbarContext = createContext<ToolbarContextType | null>(null);

export default ToolbarContext;
