import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { CLEAR, STRAIGHT, ToolType } from "../../constants/tool";
import { ColorPicker, DrawingToolPicker, StrokePicker } from "../Tool";

type LinesType = {
  tool: ToolType;
  points: number[];
  color: string;
  stroke: number;
  direction?: "vertical" | "horizontal";
};

const Canvas = (): JSX.Element => {
  const [color, setColor] = useState<string>("#000000");
  const [stroke, setStroke] = useState<number>(5);
  const [tool, setTool] = useState<ToolType>(STRAIGHT);
  const [lines, setLines] = useState<LinesType[]>([]);
  const isDrawing = useRef<boolean>(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage()!;
    const point = stage.getPointerPosition()!;

    setLines([...lines, { tool, points: [point.x, point.y], color, stroke }]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage()!;
    const point = stage.getPointerPosition()!;

    switch (tool) {
      case STRAIGHT:
        const lastLine = lines[lines.length - 1];
        const [prevX, prevY] = [lastLine.points[0], lastLine.points[1]];
        let direction = lastLine.direction;

        if (!direction) {
          if (Math.abs(point.x - prevX) < Math.abs(point.y - prevY)) {
            direction = "vertical";
            lastLine.direction = "vertical";
          } else {
            direction = "horizontal";
            lastLine.direction = "horizontal";
          }
        }

        lastLine.points = lastLine.points.concat(
          direction === "vertical" ? [prevX, point.y] : [point.x, prevY],
        );

        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
        break;
      default:
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleMouseLeave = () => {
    isDrawing.current = false;
  };

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  const handleStrokeChange = (stroke: number) => {
    setStroke(stroke);
  };

  const handleChangeTool = (tool: ToolType) => {
    if (tool === CLEAR) {
      setLines([]);
      return;
    }

    setTool(tool);
  };

  return (
    <div>
      <ColorPicker color={color} onColorChange={handleColorChange} />
      <StrokePicker stroke={stroke} onStrokeChange={handleStrokeChange} />
      <DrawingToolPicker onChangeTool={handleChangeTool} />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.stroke}
              globalCompositeOperation={"source-over"}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
