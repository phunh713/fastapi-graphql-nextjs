import AddHero from "./AddHero";
import HeroCSR from "./HeroCSR";
import HeroSSR from "./HeroSSR";

export const revalidate = 0;

async function Home({
  searchParams,
}: Readonly<{
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  return (
    <main>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: "50%" }}>
          <HeroSSR searchParams={searchParams} />
        </div>
        <div style={{ width: "50%" }}>
          <HeroCSR />
        </div>
      </div>
      <div>
        <AddHero />
      </div>
    </main>
  );
}

export default Home;
