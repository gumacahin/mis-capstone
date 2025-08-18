import LabelContext from "@shared/contexts/labelContext";
import type { Tag } from "@shared/types/common";

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
