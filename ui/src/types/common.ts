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
  id: number;
  title: string;
  assigned_to: string | null;
  completed: boolean;
  completed_date: string | null;
  created_by: string;
  created_date: string;
  due_date: string | null;
  note: string;
  priority: number | null;
  task_list: string;
}

export interface IComment {
  id?: number;
  body: string;
  date?: string | null;
  author_name?: string;
  author_id?: number;
  task_id: number;
}
