import React, { useCallback } from "react";
import { DRAWING_TOOL, ToolType } from "../../constants/tool";
import styles from "./ToolDrawingToolPicker.module.css";

type Props = {
  onChangeTool?(tool: ToolType): void;
  currentTool: ToolType;
};

const DrawingToolPicker = ({
  onChangeTool,
  currentTool,
}: Props): JSX.Element => {
  const handleChange = useCallback(
    (type: ToolType) => {
      onChangeTool && onChangeTool(type);
    },
    [onChangeTool],
  );

  return (
    <div className={styles.container}>
      {DRAWING_TOOL.map((tool) => (
        <div
          key={`tool-${tool.id}`}
          className={`${styles.tools} ${
            currentTool === tool.type && styles.select
          }`}
          onClick={handleChange.bind(null, tool.type)}
        >
          {tool.name}
        </div>
      ))}
    </div>
  );
};

export default React.memo(DrawingToolPicker);
