import { NextPageProps } from "@/app/interface";
import { strapiQueryClient } from "@/config/strapi";
import React from "react";

export async function generateStaticParams() {
  const { data } = await strapiQueryClient({
    query: {
      blogs: {
        variables: { sort: ["createdAt:desc"], pagination: { pageSize: 10000 } },
        fields: {
          data: { fields: { id: true, attributes: { fields: { slug: true } } } },
          meta: { fields: { pagination: { fields: { total: true } } } },
        },
      },
    },
  });

  return data.data.blogs.data.map((blogData) => ({
    id: blogData.id,
  }));
}

const BlogPage = async ({ params }: NextPageProps) => {
  const id = params.id;
  if (!id) return <div>Invalid blog ID</div>;

  const data = await strapiQueryClient({
    query: {
      blog: {
        variables: { id },
        fields: {
          data: {
            fields: {
              attributes: {
                fields: {
                  title: true,
                  author: true,
                  content: true,
                  createdAt: true,
                  publishedAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (data.data.error && data.data.error.errors.length) return <div>Cannot get Blog</div>;
  return (
    <div>
      page <pre>{JSON.stringify(data.data.data.blog, null, 2)}</pre>
    </div>
  );
};

export default BlogPage;
