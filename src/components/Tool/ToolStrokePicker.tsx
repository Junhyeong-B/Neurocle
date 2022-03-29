import React, { ChangeEvent } from "react";
import styles from "./ToolStrokePicker.module.css";

type Props = {
  stroke?: number;
  onStrokeChange?(stroke: number): void;
};

const StrokePicker = ({ stroke = 5, onStrokeChange }: Props): JSX.Element => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onStrokeChange && onStrokeChange(parseInt(e.target.value, 10));
  };

  return (
    <div className={styles.container}>
      <div className={styles.stroke}>
        <span>두께</span>
        <span>{stroke}px</span>
      </div>
      <input
        className={styles.range}
        width="100%"
        type="range"
        min="5"
        max="50"
        step={1}
        value={stroke}
        readOnly={true}
        onChange={handleChange}
      />
    </div>
  );
};

export default React.memo(StrokePicker);
