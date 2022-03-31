import Path from "react-svg-path";

export const getStraightPath = ({ startX, startY, endX, endY }) => {
  const path = new Path().moveTo(startX, startY).lineTo(endX, endY);

  return path.pathData.join(" ");
};

export const getCirclePath = ({ centerX, centerY, radius }) => {
  const path = new Path().circle(radius * 2, centerX, centerY);

  return path.pathData.join(" ");
};
