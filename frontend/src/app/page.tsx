import { graphQLClient } from "@/graphql/client";
import { Query, queryBuilder } from "@/graphql/query";
import Link from "next/link";

type Skill = {
  id: number;
  name: string;
  description: string;
  type: string;
};

type Hero = {
  id: number;
  name: string;
  attackType: string;
  attribute: string;
  skills: Skill[];
};

type RootQuery = {
  heroes: Hero[];
  hero: (args: { id: number }) => Hero;
};

async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = searchParams["id"];
  const queryArgs: Query<RootQuery> = {};
  if (id) {
    queryArgs.hero = () => ({
      fnArgs: { id: +id },
      id: true,
      name: true,
      attackType: true,
      attribute: true,
      skills: {
        id: true,
        name: true,
        description: true,
        type: true,
      },
    });
  }
  const builtQuery = queryBuilder<any>({ query: queryArgs });
  const response = await graphQLClient<any>(builtQuery);
  console.log(response.hero);
  return (
    <main>
      {response.hero && (
        <div>
          <h4>{response.hero.name}</h4>
          <div>{response.hero.id}</div>
          <div>{response.hero.attackType}</div>
          <div>{response.hero.attribute}</div>
          <h5>Skill</h5>
          {response.hero.skills.map((s: any) => (
            <div key={s.id} style={{ marginLeft: 10 }}>
              <div>{s.id}</div>
              <div>{s.name}</div>
              <div>{s.description}</div>
              <div>{s.type}</div>
            </div>
          ))}
        </div>
      )}
      <Link
        href={`http://localhost:3000/?id=${Math.floor(Math.random() * 5) + 1}`}>
        random
      </Link>
    </main>
  );
}

export default Home;
