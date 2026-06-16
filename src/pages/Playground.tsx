import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Spires } from "../components/playground/Spires";
import styles from "./Playground.module.css";

export function Playground() {
  useEffect(() => {
    document.title = "Playground · Jake Mosher";
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        <p className={styles.label}>Playground</p>
        <Link to="/" className={styles.home}>
          ← Home
        </Link>
      </div>

      <main className={styles.stage}>
        <Spires />
      </main>
    </div>
  );
}
