const fs = require("fs");

const data = fs.readFileSync("./src/graphql/strapiGeneratedTypes.ts", {
  encoding: "utf-8",
  flag: "r",
});

const lines = data.split("\n");

let start = false;

lines.map((l) => {
  if (!start && l.includes("type Query =")) {
    start = true;
    return l;
  }

  if (start) {
    const [arg, value] = l.split(":");
    return;
  }
});
