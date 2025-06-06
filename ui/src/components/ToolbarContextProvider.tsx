import { useState } from "react";

import ToolbarContext from "../contexts/toolbarContext";

export default function ToolBarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toolbarIcons, setToolbarIcons] = useState<React.ReactNode>(null);
  const [toolbarAdditionalIcons, setToolbarAdditionalIcons] =
    useState<React.ReactNode>(null);
  const [toolbarTitle, setToolbarTitle] = useState<React.ReactNode>(null);
  const [toolbarBottom, setToolbarBottom] = useState<React.ReactNode>(null);

  return (
    <ToolbarContext.Provider
      value={{
        toolbarIcons,
        setToolbarIcons,
        toolbarTitle,
        setToolbarTitle,
        toolbarBottom,
        setToolbarBottom,
        setToolbarAdditionalIcons,
        toolbarAdditionalIcons,
      }}
    >
      {children}
    </ToolbarContext.Provider>
  );
}
