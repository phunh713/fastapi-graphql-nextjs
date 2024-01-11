import React from "react";
import { strapiQueryClient } from "@/config/strapi";
import { Card, Flex } from "antd";
import { NextPageProps } from "../interface";
import BlogsPagination from "./BlogsPagination";
import Link from "next/link";

export const revalidate = 90;

const BlogsPage = async ({ searchParams }: NextPageProps) => {
  const page =
    searchParams["page"] && typeof searchParams["page"] === "string" && !isNaN(+searchParams["page"])
      ? +searchParams["page"]
      : 1;

  const pageSize = 4;

  const strapiData = await strapiQueryClient({
    query: {
      blogs: {
        variables: {
          sort: ["createdAt:desc"],
          pagination: {
            page,
            pageSize,
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
                  author: true,
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
    <>
      <h1 style={{ textAlign: "center" }}>Blogs</h1>
      <Flex justify="center" gap={16}>
        {blogs.map((blog) => {
          return (
            <Card key={blog.id} title={blog.attributes.title} bordered={false} style={{ width: 300 }}>
              <p>
                <strong>Author:</strong> {blog.attributes.author}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(blog.attributes.createdAt).toLocaleString()}
              </p>
              <Link href={`/blogs/${blog.id}`}>Read More</Link>
            </Card>
          );
        })}
      </Flex>
      <Flex justify="center" style={{ marginTop: 16 }}>
        <BlogsPagination pageSize={pageSize} total={meta.pagination.total} page={page} />
      </Flex>
    </>
  );
};

export default BlogsPage;
