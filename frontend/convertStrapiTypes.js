const fs = require("fs");

console.log("CONVERT STARTS");

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

console.log("READING RAW TYPES");
const data = fs.readFileSync("./src/graphql/rawStrapiTypes.ts", {
  encoding: "utf-8",
  flag: "r",
});

console.log("CONVERTING RAW TYPES");
const lines = data.split("\n");

let start = false;
let paramsType = "";

const types = lines
  .filter((l) => {
    return l.startsWith("export type ");
  })
  .map((l) => {
    const split = l.split(" ");
    return split[2];
  })
  .filter((a) => a.endsWith("Args"));

const newLines = lines.map((l) => {
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

  if (start && l.includes("};")) {
    start = false;
    return l;
  }

  if (start) {
    const [key, value] = l.split(":");
    const _key = key.endsWith("?") ? key.trim().slice(0, -1) : key.trim();
    const params = `${paramsType}${capitalize(_key)}Args`;
    if (!types.includes(params)) return l;
    return `${key.trim()}: (args: ${params}) => ${value.trim()}`;
  }

  return l;
});

console.log("WRITING CONVERTED TYPES FILES");
fs.writeFileSync("./src/graphql/convertedStrapiTypes.ts", newLines.join("\n"));

console.log("CONVERT DONE!!");
