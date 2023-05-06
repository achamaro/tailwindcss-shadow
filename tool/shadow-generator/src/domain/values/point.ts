import { clamp } from "lodash-es";

import { newInstance } from "@/lib/class";

export type Coordinates = [number, number];

export class Point {
  public readonly value: Coordinates;

  get min() {
    return 0;
  }
  get max() {
    return 1;
  }

  constructor(coordinates: Coordinates) {
    this.value = coordinates.map((v) =>
      Number(clamp(v || 0, this.min, this.max).toFixed(2))
    ) as Coordinates;
  }

  updateAt(coordinate: number, index: number) {
    const coordinates = [...this.value] as Coordinates;
    coordinates[index] = coordinate;
    return this.update(coordinates);
  }

  update(coordinates: Coordinates): this {
    return newInstance(this, coordinates);
  }
}

export class SignedPoint extends Point {
  get min() {
    return -1;
  }
}
