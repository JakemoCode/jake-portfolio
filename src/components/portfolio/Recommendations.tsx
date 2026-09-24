import styles from "./Recommendations.module.css";
import { toolsIBuiltOn, toolsIUse, type RecommendedTool } from "../../content/recommendedTools";

function ToolList({ tools }: { tools: RecommendedTool[] }) {
  return (
    <ul className={styles.list}>
      {tools.map((tool) => (
        <li key={tool.href} className={styles.tool}>
          <p className={styles.name}>
            <a href={tool.href} target="_blank" rel="noreferrer">
              {tool.name}
              <span aria-hidden="true"> ↗</span>
            </a>
            <span className={styles.by}>{tool.by}</span>
          </p>
          <p className={styles.note}>{tool.note}</p>
          {tool.became && (
            <p className={styles.became}>
              Went into{" "}
              <a href={tool.became.href} target="_blank" rel="noreferrer">
                {tool.became.name}
                <span aria-hidden="true"> ↗</span>
              </a>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Recommendations() {
  return (
    <section className={styles.section} aria-labelledby="tools-heading">
      <h2 id="tools-heading" className={styles.heading}>
        Tools I recommend
      </h2>
      <div className={styles.groups}>
        <div className={styles.group}>
          <h3 className={styles.groupHeading}>What I use heavily</h3>
          <ToolList tools={toolsIUse} />
        </div>
        <div className={styles.group}>
          <h3 className={styles.groupHeading}>What I've built on</h3>
          <ToolList tools={toolsIBuiltOn} />
        </div>
      </div>
    </section>
  );
}
