import { useEffect, useState } from "react";
import nav from "../../../../utils/navMenu.json";
import RouteLink from "../../atoms/RouteLink";
import { SmallText } from "../../atoms/Texts";
import { Container } from "./styles";
import { useRouter } from "next/router";

function Footer() {
  const [currentYear, setCurrentYear] = useState(2022);
  const { pathname } = useRouter();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Container>
      <div className="content">
        <ul className="menu">
          {nav.footer.items.map((item) => (
            <li
              key={item.path}
              className={pathname === `/${item.path}` ? "active" : ""}
            >
              <RouteLink href={`/${item.path}`}>
                <SmallText content={item.name} />
              </RouteLink>
            </li>
          ))}
        </ul>
        <SmallText content={`© ${currentYear}, Nubelson Fernandes`} />
      </div>
    </Container>
  );
}

export default Footer;
