import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useRef, useState } from "react";
import { Stage, Layer, Path } from "react-konva";
import {
  CIRCLE,
  CLEAR,
  CURVE,
  POLYGON,
  RECTANGLE,
  STRAIGHT,
  ToolType,
} from "../../constants/tool";
import { getRadius } from "../../utils/circle";
import { ColorPicker, DrawingToolPicker, StrokePicker } from "../Tool";
import {
  getCirclePath,
  getCurvePath,
  getPolygonPath,
  getRectanglePath,
  getStraightPath,
} from "../../utils/path";
import styles from "./Canvas.module.css";

type PathsType = {
  tool: ToolType;
  points: number[];
  fillColor: string;
  strokeColor: string;
  stroke: number;
  data?: string;
  curvePath?: ReactSvgPathType;
};

type ReactSvgPathType = {
  pathData: string[];
};

const Canvas = (): JSX.Element => {
  const [fillColor, setFillColor] = useState<string>("#000000");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [stroke, setStroke] = useState<number>(5);
  const [tool, setTool] = useState<ToolType>(STRAIGHT);
  const [paths, setPaths] = useState<PathsType[]>([]);
  const isDrawing = useRef<boolean>(false);

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      isDrawing.current = true;
      const stage = e.target.getStage()!;
      const point = stage.getPointerPosition()!;

      setPaths((prevPaths) => [
        ...prevPaths,
        { tool, points: [point.x, point.y], fillColor, strokeColor, stroke },
      ]);
    },
    [tool, fillColor, strokeColor, stroke],
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDrawing.current) {
        return;
      }

      const stage = e.target.getStage()!;
      const point = stage.getPointerPosition()!;
      const lastPath = paths[paths.length - 1];
      const [startX, startY] = [lastPath.points[0], lastPath.points[1]];

      switch (tool) {
        case STRAIGHT:
          const straightPathData = getStraightPath({
            startX,
            startY,
            endX: point.x,
            endY: point.y,
          });
          lastPath.data = straightPathData;
          break;
        case CURVE:
          const curvePath = getCurvePath({
            startX,
            startY,
            x: point.x,
            y: point.y,
            path: lastPath.curvePath,
          });
          lastPath.curvePath = curvePath;
          lastPath.data = curvePath.pathData.join(" ");
          break;
        case CIRCLE:
          const radius = getRadius(startX, startY, point.x, point.y);
          const circlePathData = getCirclePath({
            centerX: startX,
            centerY: startY,
            radius,
          });
          lastPath.data = circlePathData;
          break;
        case RECTANGLE:
          const rectanglePathData = getRectanglePath({
            startX,
            startY,
            x: point.x,
            y: point.y,
          });
          lastPath.data = rectanglePathData;
          break;
        case POLYGON:
          const size = getRadius(startX, startY, point.x, point.y) * 2;
          const polygonPathData = getPolygonPath({
            centerX: startX,
            centerY: startY,
            size,
            sides: stroke,
          });
          lastPath.data = polygonPathData;
          break;
        default:
      }

      paths.splice(paths.length - 1, 1, lastPath);
      setPaths(paths.concat());
    },
    [paths, stroke, tool],
  );

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleFillColorChange = useCallback((color: string) => {
    setFillColor(color);
  }, []);

  const handleStrokeColorChange = useCallback((color: string) => {
    setStrokeColor(color);
  }, []);

  const handleStrokeChange = useCallback((stroke: number) => {
    setStroke(stroke);
  }, []);

  const handleChangeTool = useCallback((tool: ToolType) => {
    if (tool === CLEAR) {
      setPaths([]);
      return;
    }

    setTool(tool);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tool_container}>
        <ColorPicker color={fillColor} onColorChange={handleFillColorChange}>
          채우기
        </ColorPicker>
        <ColorPicker
          color={strokeColor}
          onColorChange={handleStrokeColorChange}
        >
          선
        </ColorPicker>
        <StrokePicker stroke={stroke} onStrokeChange={handleStrokeChange} />
        <DrawingToolPicker onChangeTool={handleChangeTool} />
      </div>
      <div className={styles.canvas_container}>
        <Stage
          width={1000}
          height={600}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <Layer>
            {paths.map((path, i) => {
              switch (path.tool) {
                case STRAIGHT:
                case CURVE:
                  return (
                    <Path
                      key={`${path.tool}-${i}`}
                      data={path.data}
                      stroke={path.strokeColor}
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
                      fill={path.fillColor}
                      stroke={path.strokeColor}
                      strokeWidth={path.stroke}
                    />
                  );
              }
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;
