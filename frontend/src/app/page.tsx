import HeroCSR from "./HeroCSR";
import HeroSSR from "./HeroSSR";

async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <HeroSSR searchParams={searchParams} />
        </div>
        <div style={{ flex: 1 }}>
          <HeroCSR />
        </div>
      </div>
    </main>
  );
}

export default Home;
