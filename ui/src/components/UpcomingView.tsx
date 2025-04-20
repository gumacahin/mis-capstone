import { ProjectViewType } from "../types/common";
import UpcomingViewBoard from "./UpcomingViewBoard";
import UpcomingViewList from "./UpcomingViewList";

export type UpcomingViewProps = {
  view: ProjectViewType;
};

export default function UpcomingView({ view }: UpcomingViewProps) {
  const isListView = view === "list";
  return <>{isListView ? <UpcomingViewList /> : <UpcomingViewBoard />}</>;
}
