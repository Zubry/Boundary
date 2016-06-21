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
