import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Stage, Layer, Path } from "react-konva";
import { CIRCLE, CLEAR, STRAIGHT, ToolType } from "../../constants/tool";
import { getRadius } from "../../utils/circle";
import { ColorPicker, DrawingToolPicker, StrokePicker } from "../Tool";
import { getCirclePath, getStraightPath } from "../../utils/path";
import SVGDEMO from "./SVGDEMO";

type LinesType = {
  tool: ToolType;
  points: number[];
  color: string;
  stroke: number;
  data?: string;
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
          const [startX, startY] = [lastLine.points[0], lastLine.points[1]];
          const data = getStraightPath({
            startX,
            startY,
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
          const [centerX, centerY] = [lastLine.points[0], lastLine.points[1]];
          const radius = getRadius(centerX, centerY, point.x, point.y);
          const data = getCirclePath({ centerX, centerY, radius });
          lastLine.data = data;

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
      <SVGDEMO />
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
                return (
                  <Path
                    key={`${line.tool}-${i}`}
                    data={line.data}
                    stroke={line.color}
                    strokeWidth={line.stroke}
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
