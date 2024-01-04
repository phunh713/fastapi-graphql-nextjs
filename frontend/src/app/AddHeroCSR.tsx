"use client";

import { AttactType, Attribute, RootMutation } from "@/graphql/generatedTypes";
import { mutationBuilder } from "@/graphql/utils";
import React, { useMemo, useState } from "react";
import { useGraphQLMutation } from "./useGraphQL";

function AddHeroCSR() {
  const [name, setName] = useState("");
  const [attribute, setAttribute] = useState<Attribute>();
  const [attackType, setAttackType] = useState<AttactType>();
  const [baseDamage, setBaseDamage] = useState<number>();
  const [baseHealth, setBaseHealth] = useState<number>();
  const [baseMovement, setBaseMovement] = useState<number>();

  const addHeroMutationString = useMemo(() => {
    if (
      !name ||
      !attribute ||
      !attackType ||
      !baseDamage ||
      !baseHealth ||
      !baseMovement
    )
      return;
    return mutationBuilder<RootMutation>({
      mutation: {
        addHero: {
          variables: {
            input: {
              name,
              attribute: {
                isEnum: true,
                value: attribute,
              },
              attackType: {
                isEnum: true,
                value: attackType,
              },
              baseDamage,
              baseHealth,
              baseMovement,
            },
          },
          fields: {
            id: true,
            name: true,
            attackType: true,
            attribute: true,
            baseDamage: true,
          },
        },
      },
    });
  }, [attackType, attribute, baseDamage, baseHealth, baseMovement, name]);

  const {
    mutate: addHero,
    data,
    error,
  } = useGraphQLMutation(addHeroMutationString);

  return (
    <div>
      <div>
        <label htmlFor="name">name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          id="name"
        />
      </div>
      <div>
        <label htmlFor="attribute">attribute</label>
        <input
          onChange={(e) => setAttribute(e.target.value as Attribute)}
          value={attribute}
          id="attribute"
        />
      </div>
      <div>
        <label htmlFor="attackType">attackType</label>
        <input
          onChange={(e) => setAttackType(e.target.value as AttactType)}
          value={attackType}
          id="attackType"
        />
      </div>
      <div>
        <label htmlFor="baseDamage">baseDamage</label>
        <input
          onChange={(e) => setBaseDamage(+e.target.value)}
          value={baseDamage}
          id="baseDamage"
          type="number"
        />
      </div>
      <div>
        <label htmlFor="baseHealth">baseHealth</label>
        <input
          onChange={(e) => setBaseHealth(+e.target.value)}
          value={baseHealth}
          id="baseHealth"
          type="number"
        />
      </div>
      <div>
        <label htmlFor="baseMovement">baseMovement</label>
        <input
          onChange={(e) => setBaseMovement(+e.target.value)}
          value={baseMovement}
          id="baseMovement"
          type="number"
        />
      </div>

      <button
        onClick={() => {
          console.log("add");
          addHero();
        }}
      >
        Add
      </button>
      {data && (
        <pre>Data Added: {JSON.stringify(data?.data.data, null, 4)}</pre>
      )}
      {error && <pre>Error: {JSON.stringify(error, null, 4)}</pre>}
    </div>
  );
}

export default AddHeroCSR;
