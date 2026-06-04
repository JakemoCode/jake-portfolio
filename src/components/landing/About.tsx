import meBike from "../../assets/me-bike.jpg";
import styles from "./About.module.css";

export function About() {
  return (
    <section className={styles.section} aria-labelledby="about-title">
      <div className={styles.inner}>
        <figure className={`${styles.media} r-up`}>
          <img
            className={styles.photo}
            src={meBike}
            alt="Jake riding a mountain bike down red sandstone in the desert"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className={`${styles.copy} r-up`}>
          <h2 id="about-title" className={styles.title}>
            Who you&rsquo;re working with.
          </h2>
          <p className={styles.body}>
            I&rsquo;m Jake. I&rsquo;ve spent years designing and building polished
            web software, and what I love most is making the web feel simple. Now I
            put that to work for small businesses and people with something to
            share, without the tech headache.
          </p>
          <p className={styles.body}>
            You get one person who handles the whole thing and sticks around after.
            When I&rsquo;m not at the keyboard, I&rsquo;m roasting coffee, spending
            time with my wife + our new son, cooking, or out somewhere on my
            mountain bike.
          </p>
        </div>
      </div>
    </section>
  );
}
