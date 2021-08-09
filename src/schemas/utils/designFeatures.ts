enum txtEffect {
  italic = 1,
  bold = 2,
  underline = 3,
}
enum txtAlign {
  left = 1,
  right = 2,
  center = 3,
  justify = 4,
}
enum repeatType {
  "type1" = 1,
  "type2",
  "type3",
  "type4",
}
enum Flip {}
// TODO:?

enum FontSizes {
  "one" = 1,
  "two",
  "three",
  "four",
  "five",
  "six",
}

enum RotateDegree {
  "90Degree" = 90,
  "180Degree" = 180,
  "270Degree" = 270,
}

export interface RepeatPattern {
  path: string;
  width: number;
  height: number;
  repeatType: repeatType;
}

/**
 * @interface
 * an interface for picture feature
 */
export interface Pic {
  width: number;
  height: number;
  path: number;
  position: { x: number; y: number };
  rotate: RotateDegree;
  picRepeat: RepeatPattern;
}
/**
 * @interface
 * an interface for handWriting
 */
export interface HandWriting {
  width: number;
  height: number;
  path: string;
  position: [x: number, y: number];
  color: Color;
  // TODO:  only allowed font sizes
  size: FontSizes;
}

/**
 * @interface
 * an interface for color feature
 */
export interface Color {
  color: string;
}

/**
 * @interface
 * an interface for repeatPattern feature
 */

export interface Text {
  position: [x: number, y: number];
  font: string;
  size: number;
  color: Color;
  effect: txtEffect;
  align: txtAlign;
  rotate: RotateDegree;
}
export interface Emoji {
  position: [x: number, y: number];
  width: number;
  height: number;
  emojis: string;
  color: Color;
  rotate: RotateDegree;
  flip: Flip;
  // TODO:how to handle array field
}

export type DesignFeatures =
  | Emoji
  | Text
  | RepeatPattern
  | Color
  | Pic
  | HandWriting;
