import LabelContext from "../contexts/labelContext";
import type { Tag } from "../types/common";

export default function LabelContextProvider({
  children,
  label,
}: {
  children: React.ReactNode;
  label: Tag;
}) {
  return (
    <LabelContext.Provider value={label}>{children}</LabelContext.Provider>
  );
}
