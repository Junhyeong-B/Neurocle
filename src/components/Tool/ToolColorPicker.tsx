import React, { ChangeEvent } from "react";

type Props = {
  color?: string;
  onColorChange?(color: string): void;
};

const ColorPicker = ({
  color = "#000000",
  onColorChange,
}: Props): JSX.Element => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onColorChange && onColorChange(e.target.value);
  };

  return <input type="color" value={color} onChange={handleChange} readOnly />;
};

export default React.memo(ColorPicker);
