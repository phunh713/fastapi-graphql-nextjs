import config from "./genStaticConfig";
import fs from "fs";

import path from "path";

async function removeFoldersInsideBlogs(folderPath: string) {
  try {
    const contents = await fs.promises.readdir(folderPath);

    for (const content of contents) {
      const contentPath = path.join(folderPath, content);
      const isDirectory = (await fs.promises.stat(contentPath)).isDirectory();

      if (isDirectory) {
        fs.rmSync(contentPath, { recursive: true, force: true }); // Remove the empty directory
        console.log(`Removed folder: ${contentPath}`);
      }
    }

    console.log('Finished removing folders inside "blogs".');
  } catch (error) {
    console.error("Error:", error);
  }
}

const getData = async (query: string) => {
  const data = await fetch("https://paf-dev.tpptechnology.com/strapi/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const res = await data.json();

  return res.data;
};

const mapContent = (
  pagePath: string,
  mapper: {
    [template: string]: string;
  },
  mapperData: { [key: string]: any },
) => {
  const originalContent = fs.readFileSync(pagePath, "utf-8");
  let modifiedContent = originalContent;
  for (const key in mapper) {
    console.log(mapperData, mapperData[key]);
    modifiedContent = originalContent.replaceAll(`"{${key}}"`, `"${mapperData[key]}"`);
  }
  fs.writeFileSync(pagePath, modifiedContent, "utf-8");
};

const createPage = (
  folderName: string,
  srcPath: string,
  mapper: {
    [template: string]: string;
  },
  mapperData: { [key: string]: any },
) => {
  const folderPath = path.join(__dirname, srcPath, folderName);
  fs.mkdirSync(folderPath);
  const templatePath = path.join(__dirname, srcPath, "Template.tsx");
  const pagePath = path.join(__dirname, srcPath, folderName, "page.tsx");
  fs.copyFileSync(templatePath, pagePath);
  mapContent(pagePath, mapper, mapperData);
};

const main = async () => {
  for (let i = 0; i < config.length; i++) {
    const configItem = config[i];
    const folderPath = path.join(__dirname, configItem.srcPath);

    const strapiData = await getData(configItem.query);

    await removeFoldersInsideBlogs(folderPath);

    for (const item of strapiData.blogs.data) {
      createPage(item.attributes.slug, configItem.srcPath, configItem.mapper, item);
    }
  }
};

main();
