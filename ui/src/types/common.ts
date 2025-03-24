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

export interface ITask {
  id?: number;
  title: string;
  completion_date?: string | null;
  description?: string | null;
  due_date: string | null;
  priority?: number;
  section?: number;
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
export interface IProject {
  id: number;
  title: string;
  view: ProjectViewType;
  sections: ISection[];
  is_default: boolean;
}

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
