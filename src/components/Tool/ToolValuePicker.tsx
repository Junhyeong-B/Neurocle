import React, { ChangeEvent, HTMLAttributes, useCallback } from "react";
import styles from "./ToolValuePicker.module.css";

type Props = {
  value: number;
  unit: string;
  min: number;
  max: number;
  onValueChange?(value: number): void;
} & HTMLAttributes<HTMLDivElement>;

const ValuePicker = ({
  value,
  unit,
  min,
  max,
  onValueChange,
  children,
}: Props): JSX.Element => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onValueChange && onValueChange(parseInt(e.target.value, 10));
    },
    [onValueChange],
  );

  return (
    <div>
      <div className={styles.display}>
        <span>{children}</span>
        <span>
          {value}
          {unit}
        </span>
      </div>
      <input
        className={styles.range}
        width="100%"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        readOnly={true}
        onChange={handleChange}
      />
    </div>
  );
};

export default React.memo(ValuePicker);
