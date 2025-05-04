import { ProjectViewType, TagDetail } from "../types/common";
import LabelViewBoard from "./LabelViewBoard";
import LabelViewList from "./LabelViewList";

export type LabelViewProps = {
  label: TagDetail;
  view: ProjectViewType;
};

export default function LabelView({ label, view }: LabelViewProps) {
  return (
    <>
      {view === "list" ? (
        <LabelViewList label={label} />
      ) : (
        <LabelViewBoard label={label} />
      )}
    </>
  );
}
