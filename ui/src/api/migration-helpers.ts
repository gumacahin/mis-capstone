import dayjs, { type Dayjs } from "dayjs";

import type {
  PriorityEnum,
  Tag as GeneratedTag,
  Task as GeneratedTask,
  TaskAnchorModeEnum,
  User as GeneratedUser,
  ViewEnum,
} from "./client";

// Re-export all generated types for easy migration
export * from "./client";

// Helper types to bridge Dayjs vs string differences for forms
export interface TaskFormFields {
  title: string;
  description: string | null;
  completion_date: Dayjs | null; // Legacy field name
  due_date?: Dayjs | null; // New field name from generated API (optional for compatibility)
  priority: PriorityEnum;
  section: number;
  project: number;
  tags: string[];
  rrule: string | null;
  dtstart: Dayjs | null;
  anchor_mode: TaskAnchorModeEnum | null;
}

// Extended Task type that handles Dayjs for frontend convenience
export interface TaskWithDayjs
  extends Omit<GeneratedTask, "dtstart" | "due_date" | "completion_date"> {
  dtstart?: Dayjs | null; // Frontend often needs Dayjs for date manipulation
  due_date?: Dayjs | null; // Frontend date picker compatibility
  completion_date?: Dayjs | null; // Frontend date picker compatibility
}

// Legacy type aliases for backward compatibility during migration
export type TaskPriority = PriorityEnum;
export type AnchorMode = TaskAnchorModeEnum;
export type ProjectViewType = ViewEnum;

// Phase 3A: Compatibility types that match current frontend expectations exactly
// We'll migrate to proper generated types in Phase 3B
export interface Task {
  id: number;
  title: string;
  completion_date?: string | null;
  description?: string | null;
  priority?: PriorityEnum;
  section: number;
  project: number;
  project_title: string;
  section_title?: string | null;
  tags: string[];
  order: number;
  rrule: string | null;
  dtstart: Dayjs | null; // Frontend currently expects Dayjs
  anchor_mode: TaskAnchorModeEnum | null;
  comments_count: number; // Frontend currently expects number
  due_date: string | null; // API expects string dates
}
// Phase 3A: Simple section type for Project lists
export interface ProjectSection {
  title: string;
  id: number;
  is_default: boolean;
}

// Phase 3A: Compatibility Project type that matches frontend expectations
export interface Project {
  id: number;
  title: string;
  is_default: boolean;
  order: number;
  sections: ProjectSection[]; // Frontend expects sections array
  view: "list" | "board"; // View property for compatibility with ProjectDetail
}

// Phase 3A: Compatibility ProjectDetail type that matches frontend expectations
export interface ProjectDetail {
  id: number;
  title: string;
  view: "list" | "board"; // More specific than ViewEnum
  sections: Section[]; // Uses our compatibility Section type
}
// Phase 3A: Compatibility Section type that matches frontend expectations
export interface Section {
  id: number;
  title: string;
  project: number;
  is_default: boolean;
  tasks: Task[]; // Frontend expects array of Task objects
  order: number;
}
// Phase 3A: Compatibility Comment type that matches frontend expectations
export interface Comment {
  id?: number;
  comment: string;
  date?: string | null; // Frontend expects 'date' not 'submit_date'
  author_name?: string; // Frontend expects 'author_name' not 'user_name'
  user?: number;
  object_pk: number; // Frontend expects number not string
  content_type: string; // Missing from generated type
}
export type Tag = GeneratedTag;
// Phase 3A: Compatibility TagDetail type that matches frontend expectations
export interface TagDetail {
  name: string;
  id: number;
  tasks: Task[]; // Frontend expects array of Task objects, not string
}
// Phase 3A: Compatibility Profile type that matches frontend expectations
export interface Profile {
  id: number;
  name: string;
  email: string;
  picture: string; // Missing from generated User
  is_student: boolean;
  is_faculty: boolean;
  is_onboarded: boolean;
  email_digest_enabled: boolean;
  timezone?: string; // Missing from generated User
  theme: "light" | "dark" | "system"; // More specific than generated User
  projects: ProfileProject[];
}

// Additional types that might be needed
export type AnyJSON = string | number | AnyJSON[] | { [key: string]: AnyJSON };
export type DragType = "TASK" | "SECTION";
export type EndType = "NEVER" | "ON_DATE";

// Pagination type used by queries
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export type RepeatOption =
  | "daily"
  | "weekly"
  | "weekdays"
  | "monthly"
  | "yearly";

// Helper interface for profile projects (nested structure)
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

// Extended Profile type with projects array
export interface ProfileWithProjects extends GeneratedUser {
  projects: ProfileProject[];
}

// ============================================================================
// TASK TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Transform generated API Task to frontend-compatible Task
 * Handles type mismatches and date conversions
 */
export const transformApiTaskToFrontend = (apiTask: GeneratedTask): Task => {
  return {
    id: apiTask.id,
    title: apiTask.title,
    completion_date: apiTask.completion_date || null,
    description: apiTask.description || null,
    priority: apiTask.priority,
    section: apiTask.section,
    project: apiTask.project,
    project_title: apiTask.project_title,
    section_title: apiTask.section_title || null,
    tags: apiTask.tags || [],
    order: apiTask.order || 0,
    rrule: apiTask.rrule || null,
    // Convert ISO string to Dayjs for frontend compatibility
    dtstart: apiTask.dtstart ? dayjs(apiTask.dtstart) : null,
    anchor_mode: apiTask.anchor_mode || null,
    // Convert string to number for frontend compatibility
    comments_count: parseInt(apiTask.comments_count) || 0,
    due_date: apiTask.due_date || null,
  };
};

/**
 * Transform frontend TaskFormFields to API-compatible format
 * Handles Dayjs to ISO string conversion and field mapping
 */
export const transformFrontendTaskToApi = (
  formData: Partial<TaskFormFields> & { order?: number },
  options?: {
    belowTaskId?: number;
    aboveTaskId?: number;
    sourceSectionId?: number;
  },
) => {
  const apiData: Record<string, unknown> = {
    title: formData.title,
    description: formData.description,
    section: formData.section,
    priority: formData.priority,
    tags: formData.tags,
    rrule: formData.rrule,
    anchor_mode: formData.anchor_mode,
    order: formData.order,
  };

  // Handle date transformations
  if (formData.dtstart !== undefined) {
    apiData.dtstart = formData.dtstart ? formData.dtstart.toISOString() : null;
  }
  if (formData.completion_date !== undefined) {
    apiData.completion_date = dayjs.isDayjs(formData.completion_date)
      ? formData.completion_date.format("YYYY-MM-DD")
      : formData.completion_date;
  }
  if (formData.due_date !== undefined) {
    apiData.due_date = dayjs.isDayjs(formData.due_date)
      ? formData.due_date.format("YYYY-MM-DD")
      : formData.due_date;
  }

  // Add positioning options
  if (options?.belowTaskId) {
    apiData.below_task = options.belowTaskId;
  }
  if (options?.aboveTaskId) {
    apiData.above_task = options.aboveTaskId;
  }
  if (options?.sourceSectionId) {
    apiData.source_section = options.sourceSectionId;
  }

  return apiData;
};
