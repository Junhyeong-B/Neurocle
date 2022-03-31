import Path from "react-svg-path";

export const getStraightPath = ({ prevX, prevY, endX, endY }) => {
  const path = new Path().moveTo(prevX, prevY).lineTo(endX, endY);

  return path.pathData.join(" ");
};
