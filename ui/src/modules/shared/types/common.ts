import { Dayjs } from "dayjs";
export type AnyJSON = string | number | AnyJSON[] | { [key: string]: AnyJSON };

export interface ProfileProject {
  id: number;
  title: string;
  is_default: boolean;
  sections: {
    id: number;
    title: string;
    is_default: boolean;
    project: number;
  }[];
}
export interface Profile {
  id: number;
  name: string;
  email: string;
  picture: string;
  is_student: boolean;
  is_faculty: boolean;
  is_onboarded: boolean;
  theme: "light" | "dark" | "system";
  projects: ProfileProject[];
}

export type TaskPriority = "NONE" | "LOW" | "MEDIUM" | "HIGH";
export interface TaskFormFields {
  title: string;
  description: string | null;
  completion_date: Dayjs | null;
  due_date: Dayjs | null;
  priority: TaskPriority;
  section: number;
  project: number;
  tags: string[];
}

export interface Task {
  id: number;
  title: string;
  completion_date?: string | null;
  description?: string | null;
  due_date?: string | null;
  priority?: TaskPriority;
  section: number;
  project: number;
  project_title: string;
  section_title?: string | null;
  tags: string[];
  order: number;
  comments_count: number;
}

export interface Comment {
  id?: number;
  comment: string;
  date?: string | null;
  author_name?: string;
  user?: number;
  object_pk: number;
  content_type: string;
}

export type ProjectViewType = "list" | "board";

export interface Section {
  id: number;
  title: string;
  project: number;
  is_default: boolean;
  tasks: Task[];
  order: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export interface ProjectDetail {
  id: number;
  title: string;
  view: "list" | "board";
  sections: Section[];
}

export interface Project {
  id: number;
  title: string;
  is_default: boolean;
  order: number;
  sections: { title: string; id: number; is_default: boolean }[];
}

export type DragType = "TASK" | "SECTION";

export interface Tag {
  name: string;
}

export interface TagDetail {
  name: string;
  id: number;
  tasks: Task[];
}
