"use client";

import React from "react";
import { Hero } from "./interface";

type Props = {
  hero: Hero;
};

const HeroDisplay: React.FC<Props> = ({ hero }) => {
  return (
    <div>
      {/* <h4>{hero.name}</h4>
      <div>{hero.id}</div>
      <div>{hero.attackType}</div>
      <div>{hero.attribute}</div>
      <h5>Skill</h5>
      {hero.skills.map((s: Skill, index) => (
        <div key={index} style={{ marginLeft: 10 }}>
          <div>{s.id}</div>
          <div>{s.name}</div>
          <div>{s.description}</div>
          <div>{s.type}</div>
        </div>
      ))} */}
      <pre style={{ textWrap: "wrap" }}>{JSON.stringify(hero, null, 4)}</pre>
    </div>
  );
};

export default HeroDisplay;
