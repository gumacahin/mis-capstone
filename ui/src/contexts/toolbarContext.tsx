import { createContext, Dispatch, ReactNode, SetStateAction } from "react";

export interface ToolbarContextType {
  toolbarIcons: ReactNode;
  toolbarAdditionalIcons: ReactNode;
  toolbarTitle: ReactNode;
  toolbarSubtitle: ReactNode;
  setToolbarIcons: Dispatch<SetStateAction<ReactNode>>;
  setToolbarTitle: Dispatch<SetStateAction<ReactNode>>;
  setToolbarSubtitle: Dispatch<SetStateAction<ReactNode>>;
  setToolbarAdditionalIcons: Dispatch<SetStateAction<ReactNode>>;
}

const ToolbarContext = createContext<ToolbarContextType | null>(null);

export default ToolbarContext;
