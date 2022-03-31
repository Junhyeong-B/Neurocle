import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Stage, Layer, Path } from "react-konva";
import {
  CIRCLE,
  CLEAR,
  POLYGON,
  RECTANGLE,
  STRAIGHT,
  ToolType,
} from "../../constants/tool";
import { getRadius } from "../../utils/circle";
import { ColorPicker, DrawingToolPicker, StrokePicker } from "../Tool";
import {
  getCirclePath,
  getPolygonPath,
  getRectanglePath,
  getStraightPath,
} from "../../utils/path";

type PathsType = {
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
  const [paths, setPaths] = useState<PathsType[]>([]);
  const isDrawing = useRef<boolean>(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage()!;
    const point = stage.getPointerPosition()!;

    setPaths([...paths, { tool, points: [point.x, point.y], color, stroke }]);
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
          const lastPath = paths[paths.length - 1];
          const [startX, startY] = [lastPath.points[0], lastPath.points[1]];
          const data = getStraightPath({
            startX,
            startY,
            endX: point.x,
            endY: point.y,
          });
          lastPath.data = data;

          [lastPath.points[2], lastPath.points[3]] = [point.x, point.y];

          paths.splice(paths.length - 1, 1, lastPath);
          setPaths(paths.concat());
        }
        break;
      case CIRCLE:
        {
          const lastPath = paths[paths.length - 1];
          const [centerX, centerY] = [lastPath.points[0], lastPath.points[1]];
          const radius = getRadius(centerX, centerY, point.x, point.y);
          const data = getCirclePath({ centerX, centerY, radius });
          lastPath.data = data;

          paths.splice(paths.length - 1, 1, lastPath);
          setPaths(paths.concat());
        }
        break;
      case RECTANGLE:
        {
          const lastPath = paths[paths.length - 1];
          const [startX, startY] = [lastPath.points[0], lastPath.points[1]];
          const data = getRectanglePath({
            startX,
            startY,
            x: point.x,
            y: point.y,
          });
          lastPath.data = data;

          paths.splice(paths.length - 1, 1, lastPath);
          setPaths(paths.concat());
        }
        break;
      case POLYGON:
        {
          const lastPath = paths[paths.length - 1];
          const [centerX, centerY] = [lastPath.points[0], lastPath.points[1]];
          const size = getRadius(centerX, centerY, point.x, point.y);
          const data = getPolygonPath({
            centerX,
            centerY,
            size,
            sides: stroke,
          });
          lastPath.data = data;

          paths.splice(paths.length - 1, 1, lastPath);
          setPaths(paths.concat());
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
      setPaths([]);
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
          {paths.map((path, i) => {
            switch (path.tool) {
              case STRAIGHT:
                return (
                  <Path
                    key={`${path.tool}-${i}`}
                    data={path.data}
                    stroke={path.color}
                    strokeWidth={path.stroke}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case CIRCLE:
              case RECTANGLE:
              case POLYGON:
                return (
                  <Path
                    key={`${path.tool}-${i}`}
                    data={path.data}
                    fill={path.color}
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
