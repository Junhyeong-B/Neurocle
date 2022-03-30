export const getRadius = (
  centerX: number,
  centerY: number,
  nextX: number,
  nextY: number,
) => {
  const x = Math.abs(nextX - centerX);
  const y = Math.abs(nextY - centerY);

  return Math.floor((x ** 2 + y ** 2) ** 0.5);
};
