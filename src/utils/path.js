import Path from "react-svg-path";

export const getStraightPath = ({ startX, startY, endX, endY }) => {
  const path = new Path().moveTo(startX, startY).lineTo(endX, endY);

  return path.pathData.join(" ");
};

export const getCirclePath = ({ centerX, centerY, radius }) => {
  const path = new Path().circle(radius * 2, centerX, centerY);

  return path.pathData.join(" ");
};

export const getRectanglePath = ({ startX, startY, x, y }) => {
  const width = x - startX;
  const height = y - startY;

  const path = new Path()
    .moveTo(startX, startY)
    .right(width)
    .down(height)
    .left(width)
    .close();

  return path.pathData.join(" ");
};

export const getPolygonPath = ({ centerX, centerY, size, sides }) => {
  const path = new Path().regPolygon(size, sides, centerX, centerY);

  return path.pathData.join(" ");
};
