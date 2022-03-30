export const STRAIGHT = "STRAIGHT";
export const CURVE = "CURVE";
export const CIRCLE = "CIRCLE";
export const RECTANGLE = "RECTANGLE";
export const POLYGON = "POLYGON";
export const CLEAR = "CLEAR";

export type ToolType =
  | typeof STRAIGHT
  | typeof CURVE
  | typeof CIRCLE
  | typeof RECTANGLE
  | typeof POLYGON
  | typeof CLEAR;

export const DRAWING_TOOL = [
  {
    id: 0,
    type: STRAIGHT,
    name: "직선",
  },
  {
    id: 1,
    type: CURVE,
    name: "곡선",
  },
  {
    id: 2,
    type: CIRCLE,
    name: "원",
  },
  {
    id: 3,
    type: RECTANGLE,
    name: "직사각형",
  },
  {
    id: 4,
    type: POLYGON,
    name: "다각형",
  },
  {
    id: 5,
    type: CLEAR,
    name: "클리어",
  },
] as const;
