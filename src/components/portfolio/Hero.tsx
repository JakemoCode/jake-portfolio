import type { ReactNode } from "react";
import styles from "./Hero.module.css";

type Props = {
  name: string;
  tagline: ReactNode;
};

export function Hero({ name, tagline }: Props) {
  return (
    <header className={styles.hero}>
      <p className={styles.eyebrow}>Portfolio</p>
      <h1 className={styles.name}>{name}</h1>
      <p className={styles.tagline}>{tagline}</p>
    </header>
  );
}
