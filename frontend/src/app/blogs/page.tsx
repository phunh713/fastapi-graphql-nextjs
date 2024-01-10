import { Query as StrapiQuery } from "@/graphql/convertedStrapiTypes";
import { queryBuilder } from "@/graphql/utils";
import React from "react";
import { graphQLClient } from "../config";
import { strapiClient } from "@/config/strapi";
import { Query } from "@/graphql/interface";

const pureQuery: Query<StrapiQuery> = {
  query: {
    blogs: {
      variables: {
        sort: ["createdAt:desc"],
      },
      fields: {
        data: {
          fields: {
            attributes: {
              fields: {
                Title: true,
              },
            },
          },
        },
      },
    },
  },
} as const satisfies Query<StrapiQuery>;

const b: typeof pureQuery = {
  query: {},
};

const blogQuery = queryBuilder<StrapiQuery>({
  query: {
    blogs: {
      variables: {
        sort: ["createdAt:desc"],
        filters: {
          Title: {
            contains: "3",
          },
        },
      },
      fields: {
        data: {
          fields: {
            id: true,
            attributes: {
              fields: {
                Title: true,
                Author: true,
                createdAt: true,
                publishedAt: true,
                Content: true,
              },
            },
          },
        },
      },
    },
  },
});

const BlogsPage = async () => {
  const data = await graphQLClient(blogQuery);
  const strapiData = await strapiClient(blogQuery);
  console.log(strapiData);
  return (
    <div>
      <pre>{JSON.stringify(data.data, null, 4)}</pre>
    </div>
  );
};

export default BlogsPage;
