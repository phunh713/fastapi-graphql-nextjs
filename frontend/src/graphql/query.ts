type PrimaryValue = number | string | boolean | null | undefined;

export type Query<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] extends PrimaryValue | PrimaryValue[]
    ? boolean
    : T[K] extends (args: infer A) => any
    ? (args: A) => Query<ReturnType<T[K]>> & { fnArgs: A }
    : T[K] extends Record<string, any>[] | PrimaryValue
    ? Query<Extract<T[K], Record<string, any>[]>[0]>
    : T[K] extends Record<string, any> | PrimaryValue
    ? Query<Extract<T[K], Record<string, any>>>
    : never;
};

const tab = (level: number) => Array(level).fill("  ").join("");

export const queryBuilder = <T extends Record<string, any>>(query: {
  query: Query<T>;
}) => {
  const fnArgsToString = (fnArgs: Record<string, any>) => {
    let result = "";
    for (const key in fnArgs) {
      result += `${key}: ${fnArgs[key]}, `;
    }
    return result.slice(0, -2);
  };
  const queryKeyToString = (queries: Record<string, any>, level = 0) => {
    let result = "";
    for (const queryKey in queries) {
      let loopLevel = level;
      if (queryKey === "fnArgs") {
        continue;
      }
      if (typeof queries[queryKey] === "object") {
        const inside = queryKeyToString(queries[queryKey], loopLevel + 1);
        const thisTab = tab(loopLevel);

        result += `\n${thisTab}${queryKey} {${inside}\n${thisTab}}`;
      } else if (typeof queries[queryKey] === "function") {
        const inside = queryKeyToString(queries[queryKey](), loopLevel + 1);
        const argsStr = fnArgsToString(queries[queryKey]().fnArgs);
        const thisTab = tab(loopLevel);

        result += `\n${thisTab}${queryKey}(${argsStr}) {${inside}\n${thisTab}}`;
      } else if (queries[queryKey]) {
        const thisTab = tab(loopLevel);

        result += `\n${thisTab}${queryKey}`;
      }
    }
    return result;
  };
  return queryKeyToString(query);
};
