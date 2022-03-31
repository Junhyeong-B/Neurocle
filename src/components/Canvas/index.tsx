import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Stage, Layer, Circle, Path } from "react-konva";
import { CIRCLE, CLEAR, STRAIGHT, ToolType } from "../../constants/tool";
import { getRadius } from "../../utils/circle";
import { ColorPicker, DrawingToolPicker, StrokePicker } from "../Tool";
import { getStraightPath } from "../../utils/path";

type LinesType = {
  tool: ToolType;
  points: number[];
  color: string;
  stroke: number;
  data?: string;
  diameter?: number;
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
        {
          const lastLine = lines[lines.length - 1];
          const [prevX, prevY] = [lastLine.points[0], lastLine.points[1]];
          const data = getStraightPath({
            prevX,
            prevY,
            endX: point.x,
            endY: point.y,
          });
          lastLine.data = data;

          [lastLine.points[2], lastLine.points[3]] = [point.x, point.y];

          lines.splice(lines.length - 1, 1, lastLine);
          setLines(lines.concat());
        }
        break;
      case CIRCLE:
        {
          const lastLine = lines[lines.length - 1];
          const [prevX, prevY] = [lastLine.points[0], lastLine.points[1]];
          const diameter = getRadius(prevX, prevY, point.x, point.y);
          lastLine.diameter = diameter;

          lines.splice(lines.length - 1, 1, lastLine);
          setLines(lines.concat());
        }
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
          {lines.map((line, i) => {
            switch (line.tool) {
              case STRAIGHT:
                return (
                  <Path
                    key={`${line.tool}-${i}`}
                    data={line.data}
                    stroke={line.color}
                    strokeWidth={line.stroke}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case CIRCLE:
                const [x, y] = line.points;
                return (
                  <Circle
                    key={`${line.tool}-${i}`}
                    x={x}
                    y={y}
                    radius={line.diameter}
                    fill={line.color}
                  />
                );
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
