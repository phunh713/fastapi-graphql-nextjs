import { strapiQueryClient } from "@/config/strapi";
import React from "react";

type Props = {
  id: string;
};

const BlogDetail: React.FC<Props> = async ({ id }) => {
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

export default BlogDetail;
