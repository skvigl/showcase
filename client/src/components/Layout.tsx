import { Container } from "@/shared/Container";
import { NavMenu } from "@/components/NavMenu";

const navLinks = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Events",
    url: "/events",
  },
  {
    name: "Matches",
    url: "/matches",
  },
  {
    name: "Teams",
    url: "/teams",
  },
  {
    name: "Players",
    url: "/players",
  },
];

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-dvh text-gray-800">
      <header className="p-4 bg-cyan-900 text-white">
        <Container>
          <NavMenu items={navLinks} />
        </Container>
      </header>

      <main>{children}</main>

      <footer className="p-6 border-t-1 border-t-gray-300">
        <Container>
          Showcase by <b>Maksim Kadomtsev</b>
        </Container>
      </footer>
    </div>
  );
};
