import { Record as record, List as list } from 'immutable';
import check, { assert } from 'check-types';

import BoundingRectangle from './bounding-rectangle';
import Position from '@zubry/position';

const BoundingCircleRecord = record({
  center: new Position(0, 0),
  radius: 0,
});

function triangularArea([a, b, c]) {
  return Math.abs((b.x * a.y - a.x * b.y) + (c.x * b.y - b.x * c.y) + (a.x * c.y - c.x * a.y)) / 2;
}

function pointInRectangle(point, rectangle) {
  const [a, b, c, d] = rectangle.toCoordinateList();

  const triangularAreas = [
    [a, point, d],
    [d, point, c],
    [c, point, b],
    [point, b, a],
  ]
  .map(triangularArea)
  .reduce((x, y) => x + y, 0);

  return triangularAreas <= rectangle.area();
}

function intersectsCircle([c, r], [a, b]) {
  const segment = b.minus(a);

  // The vector between point a and the center of the circle
  const aToCenter = c.minus(a);

  // Project the vector (a, c) onto (a, b)
  const projection = aToCenter.project(segment);

  // The closest point is either the projection above
  // or a (if the projection is less than 0)
  // or b (if the projection is past the end of the line)
  const closest = (function closest() {
    const magnitude = aToCenter.dot(segment) / segment.abs();

    if (magnitude < 0) {
      return a;
    }

    if (magnitude > segment.abs()) {
      return b;
    }

    return projection.shift(a);
  }());

  const dist = c.minus(closest).abs();

  return dist < r;
}

export default class BoundingCircle extends BoundingCircleRecord {
  constructor({ center, radius }) {
    assert.number(radius);
    assert.instanceStrict(center, Position);
    super({ center, radius });
  }

  shift(amount) {
    return this
      .update('center', (c) => c.shift(amount));
  }

  scale(amount) {
    return this
      .update('radius', (r) => r * amount);
  }

  rotate() {
    return this;
  }

  rotateAround(amount, point) {
    assert.instanceStrict(amount, Position);
    assert.instanceStrict(point, Position);

    return this
      .update('center', (center) => center.rotateAround(amount, point));
  }

  intersects(boundary) {
    if (check.instanceStrict(boundary, BoundingCircle)) {
      const centerDifference = this
        .center
        .subtract(boundary.center)
        .absSquared();

      return (this.radius - boundary.radius) ** 2 <= centerDifference &&
        centerDifference <= (this.radius + boundary.radius) ** 2;
    }

    if (check.instanceStrict(boundary, BoundingRectangle)) {
      const r = boundary.toCoordinateList();

      const intersectingCircles = r
        .zip(r.rest().push(r.first()))
        .some((segment) => intersectsCircle([this.center, this.radius], segment));

      return pointInRectangle(this.center, boundary) || intersectingCircles;
    }

    return false;
  }

  area() {
    return this.radius ** 2 * Math.PI;
  }
}
