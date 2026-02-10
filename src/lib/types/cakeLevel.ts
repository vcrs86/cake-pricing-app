export type CakeLevelSize =
  | {
      type: "diameter";
      value: number | undefined;
    }
  | {
      type: "side";
      value: number | undefined;
    }
  | {
      type: "dimensions";
      width: number | undefined;
      height: number | undefined;
    };

export type CakeLevel = {
  id: string;
  flavor: string;
  shape: "round" | "square" | "rectangular";
  size?: CakeLevelSize;
  diameter?: number;
  servings?: number;
  complexity: "basic" | "intermediate" | "advanced" | "very_complex";
};
