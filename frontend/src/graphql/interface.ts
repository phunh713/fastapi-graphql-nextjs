export type PrimaryValue = number | string | boolean | null | undefined;

export const QUERY_VARIABLES_KEY = "variables";
export const QUERY_FIELDS_KEY = "fields";
export const QUERY_DIRECTIVE_KEY = "directive";
export const QUERY_FRAGMENTS_KEY = "fragments";

type GraphQLResponseError = {
  message: string;
} & PureObject;

export type GraphQLResponse<T> = {
  data: T;
  errors: GraphQLResponseError[];
};

export type ExtendedType<T> = {
  [K in keyof T]: T[K] extends PrimaryValue
    ? T[K] | { value: T[K]; isEnum: boolean }
    : T[K] extends PureObject
    ? ExtendedType<T[K]>
    : never;
};

export type DetailValue = {
  [QUERY_DIRECTIVE_KEY]: {
    type: "@skip" | "@include";
    if: boolean;
  };
};

export type PureObject = Record<string, any>;

type Fragment<T> = {
  [QUERY_FRAGMENTS_KEY]?: {
    [X in Extract<Extract<T, PureObject>["__typename"], string>]?: QueryBuilder<
      Extract<T, { __typename?: X }>
    >;
  };
};

export type QueryBuilder<T extends PureObject> = {
  [K in keyof T]?: T[K] extends PrimaryValue | PrimaryValue[]
    ? true | DetailValue
    : T[K] extends ((args: infer A) => any) | PrimaryValue
    ? {
        [QUERY_FIELDS_KEY]: QueryBuilder<
          ReturnType<Exclude<T[K], PrimaryValue>>
        > &
          (Extract<
            Extract<ReturnType<T[K]>, PureObject>["__typename"],
            string
          > extends string
            ? Fragment<ReturnType<T[K]>>
            : never);
        [QUERY_VARIABLES_KEY]: ExtendedType<A>;
      }
    : T[K] extends PureObject[] | PrimaryValue
    ?
        | {
            [QUERY_FIELDS_KEY]: QueryBuilder<Extract<T[K], PureObject[]>[0]> &
              Fragment<Extract<T[K], PureObject[]>[0]>;
          }
        | DetailValue
    : T[K] extends PureObject | PrimaryValue
    ?
        | {
            [QUERY_FIELDS_KEY]: QueryBuilder<Extract<T[K], PureObject>> &
              Fragment<Extract<T[K], PureObject>>;
          }
        | DetailValue
    : never;
};

export type Query<T extends PureObject> = { query: QueryBuilder<T> };
export type Mutation<T extends PureObject> = {
  mutation: QueryBuilder<T>;
};