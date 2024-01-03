type PrimaryValue = number | string | boolean | null | undefined;

const QUERY_VARIABLES_KEY = "variables";
const QUERY_FIELDS_KEY = "fields";

type ExtendedType<T> = {
  [K in keyof T]: T[K] | { value: T[K]; isEnum: boolean };
};

export type QueryBuilder<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] extends PrimaryValue | PrimaryValue[]
    ? true
    : T[K] extends (args: infer A) => any
    ? { [QUERY_FIELDS_KEY]: QueryBuilder<ReturnType<T[K]>> } & {
        [QUERY_VARIABLES_KEY]: ExtendedType<A>;
      }
    : T[K] extends Record<string, any>[] | PrimaryValue
    ? {
        [QUERY_FIELDS_KEY]: QueryBuilder<
          Extract<T[K], Record<string, any>[]>[0]
        >;
      }
    : T[K] extends Record<string, any> | PrimaryValue
    ? { [QUERY_FIELDS_KEY]: QueryBuilder<Extract<T[K], Record<string, any>>> }
    : never;
};

type Query<T extends Record<string, any>> = { query: QueryBuilder<T> };
type Mutation<T extends Record<string, any>> = {
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
    if (typeof value === "object") return `{${fnArgsToString(value)}}`;
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
    if (queryKey === QUERY_VARIABLES_KEY) {
      continue;
    } else if (queryKey === QUERY_FIELDS_KEY) {
      const inside = queryKeyToString(queries[queryKey], loopLevel + 1);
      const thisTab = tab(loopLevel);
      result += `${thisTab}${inside}`;
    } else if (
      typeof queries[queryKey] === "object" &&
      QUERY_VARIABLES_KEY in queries[queryKey]
    ) {
      const inside = queryKeyToString(queries[queryKey], loopLevel + 1);
      const argsStr = fnArgsToString(queries[queryKey][QUERY_VARIABLES_KEY]);
      const thisTab = tab(loopLevel);

      result += `\n${thisTab}${queryKey}(${argsStr}) {${inside}\n${thisTab}}`;
    } else if (typeof queries[queryKey] === "object") {
      const inside = queryKeyToString(queries[queryKey], loopLevel + 1);
      const thisTab = tab(loopLevel);

      result += `\n${thisTab}${queryKey} {${inside}\n${thisTab}}`;
    } else if (queries[queryKey]) {
      const thisTab = tab(loopLevel);

      result += `\n${thisTab}${queryKey}`;
    }
  }
  return result;
};

const queryBuilder = <T extends Record<string, any>>(query: Query<T>) => {
  return queryKeyToString(query);
};

const mutationBuilder = <T extends Record<string, any>>(
  mutation: Mutation<T>
) => {
  return queryKeyToString(mutation);
};
