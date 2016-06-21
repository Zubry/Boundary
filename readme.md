# Boundary

Contains BoundingCircle and BoundingRectangle. Exports BoundingRectangle by default.

# Installation

    npm install @zubry/boundary --save

# Usage

```javascript
import Boundary from '@zubry/boundary'; // imports BoundingRectangle
```

```javascript
import { BoundingRectangle, BoundingCircle } from '@zubry/boundary'; // imports both classes
```
# Examples

```javascript
const rect = new BoundingRectangle({ center: new Position(5, 5), rotation: new Position(45), height: 10, width: 5 });

const circle = new BoundingCircle({ center: new Position(5, 5), radius: 10 });
```

# API

Both classes have the same API

## shift(amount)

Shifts the boundary by the given amount (position)

## scale(amount)

Scales the boundary by the given amount (scalar)

## rotate(amount)

Rotates the boundary by the given amount (angle/position)

## intersects(boundary)

Checks if the boundary intersects the given boundary

## area()

Returns the area of the boundary
