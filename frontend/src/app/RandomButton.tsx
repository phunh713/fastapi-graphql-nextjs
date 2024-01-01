"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  onClick?: () => void;
};

const RandomButton: React.FC<Props> = ({ onClick }) => {
  const router = useRouter();
  const handleOnclick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(
        `http://localhost:3000/?id=${Math.floor(Math.random() * 7) + 1}`
      );
    }
  };
  return <button onClick={handleOnclick}>random</button>;
};

export default RandomButton;
