import { Record as record, List as list } from 'immutable';
import check, { assert } from 'check-types';

import BoundingCircle from './bounding-circle';
import Position from '@zubry/position';

const BoundingRectangleRecord = record({
  midpoint: new Position({ x: 0, y: 0 }),
  rotation: new Position(0),
  height: 0,
  width: 0,
});

function intersectionTest(a, b) {
  // Get upper left (UL), upper right (UR), etc. corners of a and b
  const [aUL, aUR, aLR, aLL] = a.toCoordinateList().toJS();
  const [bUL, bUR, bLR, bLL] = b.toCoordinateList().toJS();

  // Construct the 4 axes perpendicular to the 2 rectangles
  return [
    aUR.minus(aUL),
    aUR.minus(aLR),
    bUL.minus(bLL),
    bUL.minus(bUR),
  ].every((axis) => {
    const ra = [aUL, aUR, aLR, aLL]
      .map((corner) => corner.project(axis).dot(axis));

    const maxA = Math.max.apply(null, ra);
    const minA = Math.min.apply(null, ra);

    const rb = [bUL, bUR, bLR, bLL]
      .map((corner) => corner.project(axis).dot(axis));

    const maxB = Math.max.apply(null, rb);
    const minB = Math.min.apply(null, rb);

    return minB <= maxA && maxB >= minA;
  });
}

export default class BoundingRectangle extends BoundingRectangleRecord {
  constructor({ center, rotation, height, width }) {
    assert.instanceStrict(center, Position);
    assert.instanceStrict(rotation, Position);
    assert.number(height);
    assert.number(width);

    const midpoint = center;

    super({ midpoint, rotation, height, width });
  }

  shift(amount) {
    assert.instanceStrict(amount, Position);

    return this
      .update('midpoint', (midpoint) => midpoint.add(amount));
  }

  scale(amount) {
    assert.number(amount);

    return this
      .update('height', (height) => height * amount)
      .update('width', (width) => width * amount);
  }

  rotate(amount) {
    assert.instanceStrict(amount, Position);
    return this
      .update('rotation', (rotation) => rotation.add(amount));
  }

  rotateAround(amount, point) {
    assert.instanceStrict(amount, Position);
    assert.instanceStrict(point, Position);

    return this
      .update('midpoint', (midpoint) => midpoint.rotateAround(amount, point));
  }

  intersects(boundary) {
    if (check.instanceStrict(boundary, BoundingRectangle)) {
      return intersectionTest(this, boundary);
    }

    if (check.instanceStrict(boundary, BoundingCircle)) {
      return boundary.intersects(this);
    }

    return false;
  }

  area() {
    return this.height * this.width;
  }

  toCoordinateList() {
    return list([
      new Position({ x: 0, y: 0 }),
      new Position({ x: this.width, y: 0 }),
      new Position({ x: this.width, y: this.height }),
      new Position({ x: 0, y: this.height }),
    ])
    .map((point) => point
      .shift(new Position({ x: this.width / -2, y: this.height / -2 }))
      .shift(this.midpoint)
      .rotateAround(this.rotation, this.midpoint)
    );
  }
}
