const fs = require("fs");

const data = fs.readFileSync("./src/graphql/strapiGeneratedTypes.ts", {
  encoding: "utf-8",
  flag: "r",
});

const lines = data.split("\n");

let start = false;
let paramsType = "";

lines.map((l) => {
  if (!start && l.includes("type Query =")) {
    paramsType = "Query";
    start = true;
    return l;
  }

  if (!start && l.includes("type Mutation =")) {
    paramsType = "Mutation";
    start = true;
    return l;
  }

  if (start) {
    const [arg, value] = l.split(":");
    const params = `(${paramsType}${
      arg.endsWith("?") ? arg.slice(0, -1) : arg
    })`;
    return `${arg}: ${params} => ${value}`;
  }
});

console.log(lines.join("\n"));
