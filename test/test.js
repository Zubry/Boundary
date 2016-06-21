import {assert} from 'chai';
import should from 'should';

import Boundary, { BoundingCircle, BoundingRectangle } from './../lib/';
import Position from '@zubry/position';

describe('BoundingCircle', function() {
  describe('#intersect(circle)', function () {
    it('should check if two circles intersect', function () {
      const a = new BoundingCircle({ center: new Position({ x: 1, y: 0 }), radius: 2 });
      const b = new BoundingCircle({ center: new Position({ x: 3, y: 0 }), radius: 2 });
      const c = new BoundingCircle({ center: new Position({ x: 5.1, y: 0 }), radius: 2 });

      const test1 = a.intersects(b);
      const test2 = a.intersects(c);

      test1.should.be.true();
      test2.should.not.be.true();
    });
  });
});

describe('BoundingCircle', function() {
  describe('#intersect(circle)', function () {
    it('should check if a circle intersects with a rectangle', function () {
      const a = new BoundingRectangle({
        center: new Position({ x: 195, y: 200 }),
        rotation: new Position(45),
        height: 24,
        width: 192,
      });

      const radius = 15;
      const index = 7;

      const c = new BoundingCircle({ center: new Position({ x: 0, y: radius + 5}), radius })
        .shift(new Position({ x: 2 * (radius + 2.5) * (index + 0.5), y: 0 }))

      const test2 = a.intersects(c);

      test2.should.not.be.true();
    });
  });
});

describe('BoundingCircle', function() {
  describe('#intersect(circle)', function () {
    it('should check if a circle intersects with a rectangle', function () {
      const a = new BoundingRectangle({
        center: new Position({ x: 195, y: 200 }),
        rotation: new Position(0),
        height: 24,
        width: 192,
      });

      const radius = 15;
      const index = 7;

      const c = new BoundingCircle({ center: new Position({ x: 45, y: 177.5}), radius: 12.5 });

      const test2 = a.intersects(c);

      test2.should.not.be.true();
    });
  });
});
