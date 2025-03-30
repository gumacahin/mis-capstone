import { TagDetail } from "../types/common";
import LabelViewListTaskList from "./LabelViewListTaskList";
import ListViewContainer from "./ListViewContainer";

export type LabelViewListProps = {
  label: TagDetail;
};

export default function LabelViewList({ label }: LabelViewListProps) {
  return (
    <ListViewContainer>
      <LabelViewListTaskList label={label} />
    </ListViewContainer>
  );
}
