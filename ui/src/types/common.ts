import { Dayjs } from "dayjs";
export type AnyJSON = string | number | AnyJSON[] | { [key: string]: AnyJSON };

export type jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | jsonable[]
  | { [key: string]: jsonable }
  | { toJSON: () => jsonable };

export interface IProfileProject {
  id: number;
  title: string;
  is_default: boolean;
  sections: {
    id: number;
    title: string;
    is_default: boolean;
  }[];
}
export interface IProfile {
  name: string;
  email: string;
  picture: string;
  projects: IProfileProject[];
}

export type TTaskPriority = "NONE" | "LOW" | "MEDIUM" | "HIGH";
export interface IAddTaskFields {
  title: string;
  description: string | null;
  due_date: Dayjs | null;
  priority: TTaskPriority;
  section_id: number;
  project_id: number;
  labels: string[];
}

export interface ITask {
  id?: number;
  title: string;
  completion_date?: string | null;
  description?: string | null;
  due_date?: string | null;
  priority?: number;
  section_id: number;
  project_id: number;
}

export interface IComment {
  id?: number;
  body: string;
  date?: string | null;
  author_name?: string;
  author_id?: number;
  task_id: number;
}

export type ProjectViewType = "list" | "board";

export interface ISection {
  id: number;
  title: string;
  project: number;
  is_default: boolean;
  tasks: ITask[];
  order: number;
}

export interface IPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export interface IProjectDetails {
  id: number;
  name: string;
  view: "list" | "board";
  sections: ISection[];
  tasks: ITask[];
}

export interface IProjectOption {
  id: number;
  title: string;
  is_default: boolean;
  sections: { title: string; id: number; is_default: boolean }[];
}
