"use client";

import { Pagination } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  total: number;
  page: number;
  pageSize: number;
};

const BlogsPagination: React.FC<Props> = ({ page, total, pageSize }) => {
  const router = useRouter();
  return (
    <Pagination
      pageSize={pageSize}
      total={total}
      current={page}
      onChange={(page) => router.replace(`/blogs?page=${page}`)}
    />
  );
};

export default BlogsPagination;
