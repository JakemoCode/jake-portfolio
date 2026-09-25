/* Dev-only sliders for the hero field. Changes apply live and persist in this
   browser; "Copy values" puts them on the clipboard to paste back into
   FIELD_DEFAULTS. Never loaded in production (see Hero.tsx). */
import { useEffect, useState } from "react";
import styles from "./FieldTuner.module.css";
import { FIELD_DEFAULTS, type FieldParams } from "./synapseField";

type Control = { key: keyof FieldParams; label: string; min: number; max: number; step: number; rebuild?: true };

const GROUPS: Array<{ title: string; controls: Control[] }> = [
  {
    title: "Network",
    controls: [
      { key: "gap", label: "Node spacing (px)", min: 40, max: 160, step: 1, rebuild: true },
      { key: "linkReach", label: "Link reach (× spacing)", min: 1, max: 2.5, step: 0.05, rebuild: true },
      { key: "drift", label: "Drift (px)", min: 0, max: 40, step: 1 },
    ],
  },
  {
    title: "Ambient firing",
    controls: [
      { key: "ambientMin", label: "Interval, least (s)", min: 0.2, max: 15, step: 0.1 },
      { key: "ambientMax", label: "Interval, most (s)", min: 0.2, max: 20, step: 0.1 },
      { key: "ambientDepth", label: "Hops", min: 0, max: 8, step: 1 },
      { key: "ambientOdds", label: "Link odds", min: 0, max: 1, step: 0.01 },
      { key: "ambientFalloff", label: "Odds drop per hop", min: 0, max: 0.3, step: 0.01 },
      { key: "emberAmbient", label: "Terracotta share", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Click",
    controls: [
      { key: "clickDepth", label: "Hops", min: 0, max: 10, step: 1 },
      { key: "clickOdds", label: "Link odds", min: 0, max: 1, step: 0.01 },
      { key: "clickFalloff", label: "Odds drop per hop", min: 0, max: 0.3, step: 0.01 },
      { key: "emberClick", label: "Terracotta share", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Cursor",
    controls: [
      { key: "cursorRadius", label: "Reach (px)", min: 0, max: 400, step: 5 },
      { key: "cursorPull", label: "Pull (px, negative pushes)", min: -40, max: 40, step: 1 },
    ],
  },
  {
    title: "Signal",
    controls: [
      { key: "speedMin", label: "Speed, slowest (links/s)", min: 0.1, max: 3, step: 0.05 },
      { key: "speedSpread", label: "Speed, random extra", min: 0, max: 2, step: 0.05 },
      { key: "refractory", label: "Relay cooldown (s)", min: 0, max: 10, step: 0.1 },
      { key: "glowFade", label: "Glow left after 1s", min: 0.01, max: 0.9, step: 0.01 },
    ],
  },
];

const STORAGE_KEY = "synapse-field-params";

type Props = { params: FieldParams; onRebuild: () => void };

export default function FieldTuner({ params, onRebuild }: Props) {
  const [values, setValues] = useState<FieldParams>({ ...params });
  const [copied, setCopied] = useState(false);

  const apply = (next: FieldParams, rebuild: boolean) => {
    Object.assign(params, next);
    setValues({ ...next });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage can be unavailable; the values still apply for this visit
    }
    if (rebuild) onRebuild();
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) apply({ ...FIELD_DEFAULTS, ...JSON.parse(saved) }, true);
    } catch {
      // ignore unreadable storage and keep the defaults
    }
    // Restores once on mount; apply is recreated each render on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(values, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    // Clicks here must not reach the hero, which fires the field on click
    <details className={styles.tuner} onClick={(event) => event.stopPropagation()}>
      <summary className={styles.summary}>Field tuner</summary>
      <div className={styles.body}>
        {GROUPS.map((group) => (
          <fieldset key={group.title} className={styles.group}>
            <legend className={styles.legend}>{group.title}</legend>
            {group.controls.map((control) => (
              <label key={control.key} className={styles.control}>
                <span className={styles.label}>
                  {control.label}
                  {control.rebuild && <span className={styles.note}> (reseeds)</span>}
                </span>
                <output className={styles.value}>{values[control.key]}</output>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={values[control.key]}
                  onChange={(event) =>
                    apply({ ...values, [control.key]: Number(event.target.value) }, control.rebuild === true)
                  }
                />
              </label>
            ))}
          </fieldset>
        ))}
        <div className={styles.actions}>
          <button type="button" onClick={copy}>
            {copied ? "Copied" : "Copy values"}
          </button>
          <button type="button" onClick={() => apply({ ...FIELD_DEFAULTS }, true)}>
            Reset to defaults
          </button>
        </div>
      </div>
    </details>
  );
}
