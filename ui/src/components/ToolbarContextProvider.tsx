import { useState } from "react";

import ToolbarContext from "../contexts/ToolbarContext";

export default function ToolBarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toolbarItems, setToolbarItems] = useState<React.ReactNode>(null);

  return (
    <ToolbarContext.Provider value={{ toolbarItems, setToolbarItems }}>
      {children}
    </ToolbarContext.Provider>
  );
}
