import {
  DetailValue,
  QUERY_DIRECTIVE_KEY,
  QUERY_FIELDS_KEY,
  QUERY_FRAGMENTS_KEY,
  QUERY_VARIABLES_KEY,
  PureObject,
  Query,
  Mutation,
  GraphQLResponse,
  QUERY_TYPENAME_KEY,
} from "./interface";

const isDetailValue = (value: PureObject): value is DetailValue => {
  if (
    QUERY_DIRECTIVE_KEY in value &&
    typeof value.directive === "object" &&
    value.directive !== null &&
    "type" in value.directive &&
    "if" in value.directive
  )
    return true;
  return false;
};

export const isGraphQLReponse = (
  response: Object
): response is GraphQLResponse<Object> => {
  if ("data" in response && "errors" in response) return true;
  return false;
};

const fnArgsToString = (fnArgs: PureObject) => {
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
  let key: keyof typeof fnArgs;
  for (key in fnArgs) {
    const value = fnArgs[key];
    result += `${key}: ${handleArgValue(value)}, `;
  }
  return result.slice(0, -2);
};

const queryKeyToString = (queries: PureObject, level = 0) => {
  let result = "";
  const tab = (level: number) => Array(level).fill("  ").join("");

  let queryKey: keyof typeof queries;
  for (queryKey in queries) {
    let loopLevel = level;
    const thisTab = tab(loopLevel);
    const queryValue = queries[queryKey];

    if (queryKey === QUERY_VARIABLES_KEY || queryKey === QUERY_DIRECTIVE_KEY) {
      continue;
    }

    // If "fields" in Object
    if (queryKey === QUERY_FIELDS_KEY) {
      const inside = queryKeyToString(queryValue, loopLevel + 1);

      result += `${thisTab}${inside}`;

      // if "fragments" in Object
    } else if (queryKey === QUERY_FRAGMENTS_KEY) {
      const fragmentLoop = loopLevel + 1;
      if (QUERY_TYPENAME_KEY in queries) {
        result += `\n${thisTab}${QUERY_TYPENAME_KEY}`;
      }
      for (const fragmentKey in queryValue) {
        const inside = queryKeyToString(queryValue[fragmentKey], fragmentLoop);
        result += `\n${thisTab}... on ${fragmentKey} {${inside}\n${thisTab}}`;
      }

      // if "variables" in Object
    } else if (
      typeof queryValue === "object" &&
      queryValue !== null &&
      QUERY_VARIABLES_KEY in queryValue
    ) {
      const inside = queryKeyToString(queryValue, loopLevel + 1);
      const argsStr = fnArgsToString(queryValue[QUERY_VARIABLES_KEY]);

      result += `\n${thisTab}${queryKey}(${argsStr}) {${inside}\n${thisTab}}`;

      // if no special keys in Object
    } else if (typeof queryValue === "object" && queryValue !== null) {
      let key = queryKey;
      if (isDetailValue(queryValue)) {
        key = `${queryKey} ${queryValue.directive.type}(if: ${queryValue.directive.if})`;
      }

      const { directive, ...rest } = queryValue;
      let inside = "";
      if (Object.keys(rest).length) {
        inside = ` {${queryKeyToString(
          queryValue,
          loopLevel + 1
        )}\n${thisTab}}`;
      }

      result += `\n${thisTab}${key}${inside}`;
    } else if (queryValue && !(QUERY_FRAGMENTS_KEY in queries)) {
      result += `\n${thisTab}${queryKey}`;
    }
  }
  return result;
};

export const queryBuilder = <T extends PureObject>(query: Query<T>) => {
  return queryKeyToString(query);
};

export const mutationBuilder = <T extends PureObject>(
  mutation: Mutation<T>
) => {
  return queryKeyToString(mutation);
};
