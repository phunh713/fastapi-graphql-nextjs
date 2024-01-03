export type PrimaryValue = number | string | boolean | null | undefined;

const QUERY_VARIABLES_KEY = "variables";
const QUERY_FIELDS_KEY = "fields";
const QUERY_DIRECTIVE_KEY = "directive";

export type ExtendedType<T> = {
  [K in keyof T]: T[K] extends PrimaryValue
    ? T[K] | { value: T[K]; isEnum: boolean }
    : T[K] extends Record<string, any>
    ? ExtendedType<T[K]>
    : never;
};

export type DetailValue = {
  [QUERY_DIRECTIVE_KEY]: {
    type: "@skip" | "@include";
    if: boolean;
  };
};

const isDetailValue = (value: Record<string, any>): value is DetailValue => {
  if (
    QUERY_DIRECTIVE_KEY in value &&
    "type" in value.directive &&
    "if" in value.directive
  )
    return true;
  return false;
};

export type QueryBuilder<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] extends PrimaryValue | PrimaryValue[]
    ? true | DetailValue
    : T[K] extends (args: infer A) => any
    ? { [QUERY_FIELDS_KEY]: QueryBuilder<ReturnType<T[K]>> } & {
        [QUERY_VARIABLES_KEY]: ExtendedType<A>;
      }
    : T[K] extends Record<string, any>[] | PrimaryValue
    ?
        | {
            [QUERY_FIELDS_KEY]: QueryBuilder<
              Extract<T[K], Record<string, any>[]>[0]
            >;
          }
        | DetailValue
    : T[K] extends Record<string, any> | PrimaryValue
    ?
        | {
            [QUERY_FIELDS_KEY]: QueryBuilder<
              Extract<T[K], Record<string, any>>
            >;
          }
        | DetailValue
    : never;
};

export type Query<T extends Record<string, any>> = { query: QueryBuilder<T> };
export type Mutation<T extends Record<string, any>> = {
  mutation: QueryBuilder<T>;
};

const tab = (level: number) => Array(level).fill("  ").join("");

const fnArgsToString = (fnArgs: Record<string, any>) => {
  const handleArgValue = (value: any): string => {
    if (typeof value === "string") return `"${value}"`;
    if (Array.isArray(value)) {
      return `[${value
        .map((i) => {
          if (typeof i === "object") return fnArgsToString(i);
          return handleArgValue(i);
        })
        .join(", ")}]`;
    }
    if (
      typeof value === "object" &&
      value !== null &&
      "isEnum" in value &&
      "value" in value
    ) {
      return `${value.value}`.replaceAll('"', "");
    }
    if (typeof value === "object" && value !== null)
      return `{${fnArgsToString(value)}}`;
    return value;
  };
  let result = "";
  for (const key in fnArgs) {
    const value = fnArgs[key];
    result += `${key}: ${handleArgValue(value)}, `;
  }
  return result.slice(0, -2);
};

const queryKeyToString = (queries: Record<string, any>, level = 0) => {
  let result = "";
  for (const queryKey in queries) {
    let loopLevel = level;
    const thisTab = tab(loopLevel);
    const queryValue = queries[queryKey];

    if (queryKey === QUERY_VARIABLES_KEY || queryKey === QUERY_DIRECTIVE_KEY) {
      continue;
    }
    if (queryKey === QUERY_FIELDS_KEY) {
      const inside = queryKeyToString(queryValue, loopLevel + 1);

      result += `${thisTab}${inside}`;
    } else if (
      typeof queryValue === "object" &&
      queryValue !== null &&
      QUERY_VARIABLES_KEY in queryValue
    ) {
      const inside = queryKeyToString(queryValue, loopLevel + 1);
      const argsStr = fnArgsToString(queryValue[QUERY_VARIABLES_KEY]);

      result += `\n${thisTab}${queryKey}(${argsStr}) {${inside}\n${thisTab}}`;
    } else if (typeof queryValue === "object" && queryValue !== null) {
      const key = isDetailValue(queryValue)
        ? `${queryKey} ${queryValue.directive.type}(if: ${queryValue.directive.if})`
        : queryKey;
      const { directive, ...rest } = queryValue;
      let inside = "";
      if (Object.keys(rest).length) {
        inside = ` {${queryKeyToString(
          queryValue,
          loopLevel + 1
        )}\n${thisTab}}`;
      }

      result += `\n${thisTab}${key}${inside}`;
    } else if (queryValue) {
      result += `\n${thisTab}${queryKey}`;
    }
  }
  return result;
};

export const queryBuilder = <T extends Record<string, any>>(
  query: Query<T>
) => {
  return queryKeyToString(query);
};

export const mutationBuilder = <T extends Record<string, any>>(
  mutation: Mutation<T>
) => {
  return queryKeyToString(mutation);
};
