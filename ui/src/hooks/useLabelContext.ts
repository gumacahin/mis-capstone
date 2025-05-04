import { useContext } from "react";

import LabelContext from "../contexts/labelContext";

export default function useLabelContext() {
  const label = useContext(LabelContext);
  return label ?? null;
}
