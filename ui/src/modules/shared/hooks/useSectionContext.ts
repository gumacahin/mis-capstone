import { useContext } from "react";

import SectionContext from "../contexts/sectionContext";

export default function useSectionContext() {
  const section = useContext(SectionContext);
  if (!section) {
    throw new Error(
      "useSectionContext must be used within a ProjectSectionContextProvider",
    );
  }
  return section;
}
