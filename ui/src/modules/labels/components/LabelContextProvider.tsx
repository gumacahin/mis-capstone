import type { Tag } from "@shared";
import LabelContext from "@shared/contexts/labelContext";

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
