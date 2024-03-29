import logo from "@/assets/logo_black.svg";
import menu from "@/utils/menu.json";
import moment from "moment";
import Image from "next/image";
import {
  RiFileWordLine,
  RiInstagramLine,
  RiTiktokLine,
  RiTwitterXLine,
  RiUnsplashLine,
  RiYoutubeLine,
} from "react-icons/ri";
import { Menu } from "../Menu";

import styles from "./styles.module.scss";

interface SocialItemProps {
  name: string;
  path: string;
}

interface FooterProps {
  socialList: SocialItemProps[];
}

export const Footer = ({ socialList }: FooterProps) => {
  const getIcon = (name: string) => {
    switch (name) {
      case "Instagram":
        return <RiInstagramLine color="#000000" />;

      case "Youtube":
        return <RiYoutubeLine color="#000000" />;

      case "Unsplash":
        return <RiUnsplashLine color="#000000" />;

      case "Tiktok":
        return <RiTiktokLine color="#000000" />;

      case "Twitter":
        return <RiTwitterXLine color="#000000" />;

      default:
        return <RiFileWordLine color="#000000" />;
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <Image src={logo} alt="nubl. logo" className={styles.logo} />
          {menu.footer.length ? <Menu items={menu.footer} color="black" /> : null}
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>By Nubelson, with ❤️ and ☕.</p>
            <p>Copyright © {moment().year()}, All rights reserved.</p>
          </div>
          <div className={styles.social_media}>
            {socialList.map((item, index) => {
              return (
                <a
                  key={index}
                  href={item.path}
                  target="_bank"
                  rel="noopener"
                  aria-label={`${item.name} "social icon"`}
                >
                  {getIcon(item.name)}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
