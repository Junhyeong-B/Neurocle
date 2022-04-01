import React, { useCallback, useState } from "react";
import { CLEAR, DRAWING_TOOL, ToolType } from "../../constants/tool";
import styles from "./ToolDrawingToolPicker.module.css";

type Props = {
  onChangeTool?(tool: ToolType): void;
};

const DrawingToolPicker = ({ onChangeTool }: Props): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const handleChange = useCallback(
    (type: ToolType, i: number) => {
      if (type !== CLEAR) {
        setCurrentIndex(i);
      }

      onChangeTool && onChangeTool(type);
    },
    [onChangeTool],
  );

  return (
    <div className={styles.container}>
      {DRAWING_TOOL.map((tool, i) => (
        <div
          className={`${styles.tools} ${i === currentIndex && styles.select}`}
          key={`tool-${tool.id}`}
          onClick={handleChange.bind(null, tool.type, i)}
        >
          {tool.name}
        </div>
      ))}
    </div>
  );
};

export default React.memo(DrawingToolPicker);
