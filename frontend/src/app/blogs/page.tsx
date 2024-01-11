import React from "react";
import { strapiQueryClient } from "@/config/strapi";

export const revalidate = 600;

const BlogsPage = async () => {
  const strapiData = await strapiQueryClient({
    query: {
      blogs: {
        variables: {
          sort: ["createdAt:desc"],
          pagination: {
            page: 1,
            pageSize: 5,
          },
        },
        fields: {
          meta: {
            fields: {
              pagination: { fields: { total: true, page: true, pageCount: true, pageSize: true } },
            },
          },
          data: {
            fields: {
              id: true,
              attributes: {
                fields: {
                  title: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const meta = strapiData.data.data.blogs.meta;
  const blogs = strapiData.data.data.blogs.data;

  return (
    <div>
      <pre>{JSON.stringify(meta, null, 4)}</pre>
      <pre>{JSON.stringify(blogs, null, 4)}</pre>
    </div>
  );
};

export default BlogsPage;
