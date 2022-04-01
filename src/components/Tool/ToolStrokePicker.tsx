import React, { ChangeEvent, useCallback } from "react";
import styles from "./ToolStrokePicker.module.css";

type Props = {
  stroke?: number;
  onStrokeChange?(stroke: number): void;
};

const StrokePicker = ({ stroke, onStrokeChange }: Props): JSX.Element => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onStrokeChange && onStrokeChange(parseInt(e.target.value, 10));
    },
    [onStrokeChange],
  );

  return (
    <div>
      <div className={styles.display}>
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
