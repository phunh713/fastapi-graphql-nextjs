"use client";

import { useRouter } from "next/navigation";
import React from "react";

const HeroButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() =>
        router.push(
          `http://localhost:3000/?id=${Math.floor(Math.random() * 5) + 1}`
        )
      }>
      Random
    </button>
  );
};

export default HeroButton;
