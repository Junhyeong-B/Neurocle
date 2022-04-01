import React, { ChangeEvent, HTMLAttributes, useCallback } from "react";
import styles from "./ToolColorPicker.module.css";

type Props = {
  color?: string;
  onColorChange?(color: string): void;
} & HTMLAttributes<HTMLDivElement>;

const ColorPicker = ({
  color,
  onColorChange,
  children,
}: Props): JSX.Element => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onColorChange && onColorChange(e.target.value);
    },
    [onColorChange],
  );

  return (
    <div className={styles.container}>
      <span>{children}</span>
      <input type="color" value={color} onChange={handleChange} readOnly />
    </div>
  );
};

export default React.memo(ColorPicker);
