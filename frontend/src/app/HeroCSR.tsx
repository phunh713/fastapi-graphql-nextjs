"use client";

import { queryBuilder } from "@/graphql/utils";
import React, { useMemo } from "react";
import HeroDisplay from "./HeroDisplay";
import RandomButton from "./RandomButton";
import { RootQuery } from "@/graphql/generatedTypes";
import { useGraphQLQuery } from "./useGraphQL";
import { Hero } from "./interface";

const HeroCSR = () => {
  const [id, setId] = React.useState<string | undefined>(undefined);

  const query = useMemo(() => {
    if (!id) return undefined;
    return queryBuilder<RootQuery>({
      query: {
        hero: {
          variables: {
            id,
          },
          fields: {
            id: true,
            name: true,
            avatar: true,
            attribute: true,
            attackType: true,
            baseDamage: true,
            baseHealth: true,
            baseMovement: true,
            skills: {
              fields: {
                id: true,
                name: true,
                description: true,
                type: true,
                cooldown: true,
                manaCost: true,
              },
            },
          },
        },
      },
    });
  }, [id]);

  const { data: res, error } = useGraphQLQuery<{ hero: Hero }>(query);
  return (
    <div>
      <h3>Client Side Rendering</h3>
      <RandomButton
        onClick={() => setId(`${Math.floor(Math.random() * 10) + 1}`)}
      />
      {res?.hero && <HeroDisplay hero={res.hero} />}
      <div style={{ color: "red", marginTop: 20 }}>
        {typeof error === "string" && error}
      </div>
    </div>
  );
};

export default HeroCSR;
