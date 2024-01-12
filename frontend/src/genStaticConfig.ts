import { Query } from "./graphql/convertedStrapiTypes";
import { queryBuilder } from "./graphql/utils";

type ConfigItem = {
  entity: string;
  endpoint?: string;
  query: string;
  srcPath: string;
  mapper: {
    [template: string]: string;
  };
};

const config: ConfigItem[] = [
  {
    entity: "blog",
    endpoint: "",
    query: queryBuilder<Query>({
      query: {
        blogs: {
          variables: { sort: ["createdAt:desc"], pagination: { pageSize: 10000 } },
          fields: {
            data: { fields: { id: true, attributes: { fields: { slug: true } } } },
            meta: { fields: { pagination: { fields: { total: true } } } },
          },
        },
      },
    }),
    srcPath: "./app/blogs",
    mapper: {
      id: "id",
    },
  },
];

export default config;
