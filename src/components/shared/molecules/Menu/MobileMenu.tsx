import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import { navItems } from "../../../../utils/navItems";
import { NavItems } from "./renderItems";
import { MobileContainer } from "./styles";

export const MobileMenu = () => {
  const { route } = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  return (
    <MobileContainer>
      {menuOpen ? (
        <RiCloseLine className="icon icon_close" onClick={toggleMenu} />
      ) : (
        <RiMenu3Line className="icon" onClick={toggleMenu} />
      )}

      {menuOpen && (
        <div className="container">
          <NavItems items={navItems} scrollAction={() => setMenuOpen(false)} />
        </div>
      )}
    </MobileContainer>
  );
};
