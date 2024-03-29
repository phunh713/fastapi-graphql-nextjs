export type PrimaryValue = number | string | boolean | null | undefined;
export type PureObject = Record<string, any>;

export const QUERY_VARIABLES_KEY = "variables";
export const QUERY_FIELDS_KEY = "fields";
export const QUERY_DIRECTIVE_KEY = "directive";
export const QUERY_FRAGMENTS_KEY = "fragments";
export const QUERY_TYPENAME_KEY = "__typename";
export const QUERY_KEY = "query";
export const MUTATION_KEY = "mutation";

type GraphQLResponseError = {
  message: string;
} & PureObject;

export type GraphQLResponse<T> = {
  data: T;
  error?: { errors: GraphQLResponseError[] };
};

export type ExtendedType<T> = {
  [K in keyof T]: T[K] extends PrimaryValue
    ? T[K] | { value: T[K]; isEnum: boolean }
    : T[K] extends PrimaryValue[] | PrimaryValue
      ? T[K]
      : T[K] extends infer U | PrimaryValue
        ? ExtendedType<U extends PureObject[] ? U[0] : U>
        : never;
};

// type SortKey<T> = T extends PureObject ? `${keyof T & string}:${"asc" | "desc"}` : never;
// type SortKey<T> = keyof {
//   [K in keyof T & string as T[K] extends infer U
//     ? U extends PrimaryValue
//       ? `${K}:${"asc" | "desc"}`
//       : U extends PureObject[] | PrimaryValue
//       ? SortKey<Extract<T[K], PureObject[]>[0]>
//       : U extends PureObject | PrimaryValue
//       ? SortKey<Extract<T[K], PureObject>>
//       : `${K}:${"asc" | "desc"}`
//     : `${K}:${"asc" | "desc"}`]: never;
// } &
//   string;

// export type Sort<T, U> = "sort" extends keyof T
//   ? T & { sorts?: SortKey<U>[] }
//   : never;

export type DetailValue = {
  [QUERY_DIRECTIVE_KEY]: {
    type: "@skip" | "@include";
    if: boolean;
  };
};

type Fragment<T> = {
  [QUERY_FRAGMENTS_KEY]?: {
    [X in Extract<Extract<T, PureObject>["__typename"], string>]?: QueryBuilder<Extract<T, { __typename?: X }>>;
  };
};

type IsRecordsUnion<T extends PureObject, P extends string = keyof T & string> = Extract<
  { [K in keyof T as K extends P ? K : "__isUnion__"]: true },
  { __isUnion__: true }
> extends never
  ? false
  : true;

type GetQueryBuilder<T extends PureObject> = IsRecordsUnion<T> extends true
  ? QueryBuilder<{ __typename: string }>
  : QueryBuilder<T>;

export type QueryBuilder<T extends PureObject> = {
  [K in keyof T]?: T[K] extends PrimaryValue | PrimaryValue[]
    ? true | DetailValue
    : T[K] extends ((args: infer A) => infer R) | PrimaryValue
      ? {
          [QUERY_FIELDS_KEY]: GetQueryBuilder<Extract<R, PureObject>> &
            (Extract<Extract<R, PureObject>["__typename"], string> extends string ? Fragment<R> : never);
          [QUERY_VARIABLES_KEY]: ExtendedType<A>;
        }
      : T[K] extends PureObject[] | PrimaryValue
        ?
            | {
                [QUERY_FIELDS_KEY]: GetQueryBuilder<Extract<T[K], PureObject[]>[0]> &
                  Fragment<Extract<T[K], PureObject[]>[0]>;
              }
            | DetailValue
        : T[K] extends PureObject | PrimaryValue
          ?
              | {
                  [QUERY_FIELDS_KEY]: GetQueryBuilder<Extract<T[K], PureObject>> & Fragment<Extract<T[K], PureObject>>;
                }
              | DetailValue
          : never;
};

export type MapRemove<T extends PureObject> = {
  [K in keyof T as K extends typeof QUERY_VARIABLES_KEY
    ? never
    : K extends typeof QUERY_KEY | typeof MUTATION_KEY | typeof QUERY_FIELDS_KEY
      ? "_remove_"
      : K]: T[K] extends PrimaryValue | PureObject[]
    ? T[K]
    : T[K] extends PureObject | PrimaryValue
      ? MapRemove<Extract<T[K], PureObject>>
      : never;
};

export type Query<T extends PureObject> = { query: QueryBuilder<T> };
export type Mutation<T extends PureObject> = {
  mutation: QueryBuilder<T>;
};

export type RemoveKey<T extends PureObject> = "_remove_" extends keyof T
  ? (T["_remove_"] extends PureObject ? RemoveKey<T["_remove_"]> : {}) & {
      [K in keyof Omit<T, "_remove_">]: Omit<T, "_remove_">[K] extends PrimaryValue
        ? Omit<T, "_remove_">[K]
        : Omit<T, "_remove_">[K] extends PureObject | PrimaryValue
          ? RemoveKey<Omit<T, "_remove_">[K]>
          : never;
    }
  : { [K in keyof T]: T[K] extends PrimaryValue | PureObject[] ? T[K] : RemoveKey<Extract<T[K], PureObject>> };

export type MapQuery<T extends PureObject, Map> = {
  [K in keyof T]: K extends keyof Map
    ? Map[K] extends PrimaryValue
      ? Map[K]
      : Map[K] extends ((arg: any) => infer R) | PrimaryValue
        ? MapQuery<T[K], Extract<R, PureObject>>
        : Map[K] extends PureObject[] | PrimaryValue
          ? MapQuery<T[K], Extract<Map[K], PureObject[]>[0]>[]
          : Map[K] extends PureObject | PrimaryValue
            ? MapQuery<T[K], Extract<Map[K], PureObject>>
            : "never2"
    : "never1";
};
