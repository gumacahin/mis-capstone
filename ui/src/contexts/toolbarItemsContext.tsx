import { createContext, ReactNode } from "react";

const ToolbarItemsContext = createContext<React.Dispatch<
  React.SetStateAction<ReactNode[]>
> | null>(null);

const ToolbarItemsProvider = ToolbarItemsContext.Provider;

export default ToolbarItemsProvider;
export { ToolbarItemsContext };
