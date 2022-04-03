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
import { ColorPicker, DrawingToolPicker, ValuePicker } from "../Tool";
import {
  getCirclePath,
  getCurvePath,
  getPolygonPath,
  getRectanglePath,
  getStraightPath,
} from "../../utils/path";
import styles from "./Canvas.module.css";
import { useSessionStorage } from "../../hooks";

type PathsType = {
  tool: ToolType;
  points: number[];
  fillColor: string;
  strokeColor: string;
  stroke: number;
  data?: string;
  curvePath?: ReactSvgPathType;
  isDrawing?: boolean;
};

type ReactSvgPathType = {
  pathData: string[];
};

const Canvas = (): JSX.Element => {
  const [storedValue, setStorageValue, deleteValue] = useSessionStorage(
    "CANVAS_JUNHYEONG",
    {
      fillColor: "#000000",
      strokeColor: "#000000",
      stroke: 5,
      diagonal: 3,
      tool: STRAIGHT as typeof STRAIGHT,
      paths: [],
    },
  );

  const [strokeColor, setStrokeColor] = useState<string>(
    storedValue.strokeColor,
  );
  const [fillColor, setFillColor] = useState<string>(storedValue.fillColor);
  const [stroke, setStroke] = useState<number>(storedValue.stroke);
  const [diagonal, setDiagonal] = useState<number>(storedValue.diagonal);
  const [tool, setTool] = useState<ToolType>(storedValue.tool);
  const [paths, setPaths] = useState<PathsType[]>(storedValue.paths);
  const [currentPath, setCurrentPath] = useState<PathsType>({
    tool: storedValue.tool,
    points: [0, 0],
    fillColor: storedValue.fillColor,
    strokeColor: storedValue.strokeColor,
    stroke: storedValue.stroke,
    isDrawing: false,
  });
  const isDrawing = useRef<boolean>(false);

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      isDrawing.current = true;
      const stage = e.target.getStage()!;
      const point = stage.getPointerPosition()!;

      setCurrentPath({
        tool,
        points: [point.x, point.y],
        fillColor,
        strokeColor,
        stroke,
        isDrawing: true,
      });
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
      setCurrentPath((prevPath) => {
        const [startX, startY] = [prevPath.points[0], prevPath.points[1]];
        let data = "";
        let curvePath: ReactSvgPathType = {
          pathData: [],
        };

        switch (tool) {
          case STRAIGHT:
            const straightPathData = getStraightPath({
              startX,
              startY,
              endX: point.x,
              endY: point.y,
            });
            data = straightPathData;
            break;
          case CURVE:
            const currentCurvePath = getCurvePath({
              startX,
              startY,
              x: point.x,
              y: point.y,
              path: prevPath.curvePath,
            });
            curvePath = currentCurvePath;
            data = curvePath.pathData.join(" ");
            break;
          case CIRCLE:
            const radius = getRadius(startX, startY, point.x, point.y);
            const circlePathData = getCirclePath({
              centerX: startX,
              centerY: startY,
              radius,
            });
            data = circlePathData;
            break;
          case RECTANGLE:
            const rectanglePathData = getRectanglePath({
              startX,
              startY,
              x: point.x,
              y: point.y,
            });
            data = rectanglePathData;
            break;
          case POLYGON:
            const size = getRadius(startX, startY, point.x, point.y) * 2;
            const polygonPathData = getPolygonPath({
              centerX: startX,
              centerY: startY,
              size,
              sides: diagonal,
            });
            data = polygonPathData;
            break;
          default:
        }

        return {
          ...prevPath,
          data,
          curvePath: curvePath || undefined,
        };
      });
    },
    [tool, diagonal],
  );

  const handleDrawEnd = useCallback(() => {
    setPaths((prevPaths) => {
      const newPaths = prevPaths.concat(currentPath);
      setStorageValue({
        fillColor,
        strokeColor,
        stroke,
        diagonal,
        tool,
        paths: newPaths,
      });
      return newPaths;
    });
    setCurrentPath((prevCurrentPath) => ({
      ...prevCurrentPath,
      isDrawing: false,
    }));

    isDrawing.current = false;
  }, [
    fillColor,
    strokeColor,
    stroke,
    diagonal,
    tool,
    currentPath,
    setStorageValue,
  ]);

  const handleFillColorChange = useCallback((color: string) => {
    setFillColor(color);
  }, []);

  const handleStrokeColorChange = useCallback((color: string) => {
    setStrokeColor(color);
  }, []);

  const handleStrokeChange = useCallback((stroke: number) => {
    setStroke(stroke);
  }, []);

  const handleDiagonalChange = useCallback((diagonal: number) => {
    setDiagonal(diagonal);
  }, []);

  const handleChangeTool = useCallback(
    (tool: ToolType) => {
      if (tool === CLEAR) {
        setPaths([]);
        deleteValue();
        return;
      }

      setTool(tool);
    },
    [deleteValue],
  );

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
        <ValuePicker
          value={stroke}
          onValueChange={handleStrokeChange}
          min={5}
          max={50}
          unit="px"
        >
          두께
        </ValuePicker>
        {tool === POLYGON && (
          <ValuePicker
            value={diagonal}
            onValueChange={handleDiagonalChange}
            min={3}
            max={50}
            unit="개"
          >
            다각형
          </ValuePicker>
        )}
        <DrawingToolPicker currentTool={tool} onChangeTool={handleChangeTool} />
      </div>
      <div className={styles.canvas_container}>
        <Stage
          width={1000}
          height={600}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleDrawEnd}
          onMouseLeave={handleDrawEnd}
        >
          <Layer>
            {paths &&
              paths.map((path, i) => {
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
            {currentPath.isDrawing && (
              <Path
                data={currentPath.data}
                fill={
                  currentPath.tool === CURVE ? undefined : currentPath.fillColor
                }
                stroke={currentPath.strokeColor}
                strokeWidth={currentPath.stroke}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;
