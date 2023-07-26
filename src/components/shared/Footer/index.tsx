import logo from "@/assets/logo_black.svg";
import moment from "moment";
import Image from "next/image";
import {
  RiFileWordLine,
  RiInstagramLine,
  RiTwitterLine,
  RiUnsplashLine,
  RiYoutubeLine,
} from "react-icons/ri";
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

      case "Twitter":
        return <RiTwitterLine color="#000000" />;

      default:
        return <RiFileWordLine color="#000000" />;
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Image src={logo} alt="nubl. logo" className={styles.logo} />

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>With ❤️ and ☕.</p>
            <p>Copyright © {moment().year()}, All rights reserved.</p>
          </div>
          <div className={styles.social_media}>
            {socialList.map((item, index) => {
              return (
                <a
                  key={index}
                  href={item.path}
                  target="_bank"
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
