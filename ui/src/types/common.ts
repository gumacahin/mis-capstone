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
