import * as p2 from 'p2';

export default class Scene {
  world: p2.World;
  head?: p2.Body;
  bodies: p2.Body[];
  constraints: p2.Constraint[];
  time: number;
  fitness: number;

  constructor() {
    this.world = new p2.World({
      gravity: [0, -10],
    });
    this.bodies = [];
    this.constraints = [];
    this.createWorld();
    this.fitness = 0;
    this.time = 0;
  }

  getPositions = () => {
    const positions: number[] = [];
    for(let body of this.bodies) {
      positions.push(body.position[0]);
      positions.push(body.position[1]);
    }
    return positions;
  };

  createWorld = () => {
    const jointLimit = Math.PI / 2;

    const shouldersDistance = 0.5,
      upperArmLength = 0.4,
      lowerArmLength = 0.4,
      upperArmSize = 0.2,
      lowerArmSize = 0.2,
      neckLength = 0.1,
      headRadius = 0.25,
      upperBodyLength = 0.6,
      pelvisLength = 0.4,
      upperLegLength = 0.5,
      upperLegSize = 0.2,
      lowerLegSize = 0.2,
      lowerLegLength = 0.5;

    const BODYPARTS = Math.pow(2, 2),
      GROUND = Math.pow(2, 3),
      OTHER = Math.pow(2, 4),
      bodyPartShapes: Array<p2.Shape> = [];

    const headShape = new p2.Circle({ radius: headRadius }),
      upperArmShapeLeft = new p2.Box({
        width: upperArmLength,
        height: upperArmSize,
      }),
      upperArmShapeRight = new p2.Box({
        width: upperArmLength,
        height: upperArmSize,
      }),
      lowerArmShapeLeft = new p2.Box({
        width: lowerArmLength,
        height: lowerArmSize,
      }),
      lowerArmShapeRight = new p2.Box({
        width: lowerArmLength,
        height: lowerArmSize,
      }),
      upperBodyShape = new p2.Box({
        width: shouldersDistance,
        height: upperBodyLength,
      }),
      pelvisShape = new p2.Box({
        width: shouldersDistance,
        height: pelvisLength,
      }),
      upperLegShapeLeft = new p2.Box({
        width: upperLegSize,
        height: upperLegLength,
      }),
      upperLegShapeRight = new p2.Box({
        width: upperLegSize,
        height: upperLegLength,
      }),
      lowerLegShapeLeft = new p2.Box({
        width: lowerLegSize,
        height: lowerLegLength,
      }),
      lowerLegShapeRight = new p2.Box({
        width: lowerLegSize,
        height: lowerLegLength,
      });

    bodyPartShapes.push(
      headShape,
      upperArmShapeRight,
      upperArmShapeLeft,
      lowerArmShapeRight,
      lowerArmShapeLeft,
      upperBodyShape,
      pelvisShape,
      upperLegShapeRight,
      upperLegShapeLeft,
      lowerLegShapeRight,
      lowerLegShapeLeft
    );

    for (let i = 0; i < bodyPartShapes.length; i++) {
      const s = bodyPartShapes[i];
      s.collisionGroup = BODYPARTS;
      s.collisionMask = GROUND | OTHER;
    }

    const world = this.world;

    // Lower legs
    const lowerLeftLeg = new p2.Body({
      mass: 1,
      position: [-shouldersDistance / 2, lowerLegLength / 2],
    });
    const lowerRightLeg = new p2.Body({
      mass: 1,
      position: [shouldersDistance / 2, lowerLegLength / 2],
    });
    lowerLeftLeg.addShape(lowerLegShapeLeft);
    lowerRightLeg.addShape(lowerLegShapeRight);
    this.addBody(lowerLeftLeg);
    this.addBody(lowerRightLeg);

    // Upper legs
    const upperLeftLeg = new p2.Body({
      mass: 1,
      position: [
        -shouldersDistance / 2,
        lowerLeftLeg.position[1] + lowerLegLength / 2 + upperLegLength / 2,
      ],
    });
    const upperRightLeg = new p2.Body({
      mass: 1,
      position: [
        shouldersDistance / 2,
        lowerRightLeg.position[1] + lowerLegLength / 2 + upperLegLength / 2,
      ],
    });
    upperLeftLeg.addShape(upperLegShapeLeft);
    upperRightLeg.addShape(upperLegShapeRight);
    this.addBody(upperLeftLeg);
    this.addBody(upperRightLeg);

    // Pelvis
    const pelvis = new p2.Body({
      mass: 1,
      position: [
        0,
        upperLeftLeg.position[1] + upperLegLength / 2 + pelvisLength / 2,
      ],
    });
    pelvis.addShape(pelvisShape);
    this.addBody(pelvis);

    // Upper body
    const upperBody = new p2.Body({
      mass: 1,
      position: [
        0,
        pelvis.position[1] + pelvisLength / 2 + upperBodyLength / 2,
      ],
    });
    upperBody.addShape(upperBodyShape);
    this.addBody(upperBody);

    // Head
    const head = new p2.Body({
      mass: 1,
      position: [
        0,
        upperBody.position[1] + upperBodyLength / 2 + headRadius + neckLength,
      ],
    });
    head.addShape(headShape);
    this.addBody(head);
    this.head = head;

    // Upper arms
    const upperLeftArm = new p2.Body({
      mass: 1,
      position: [
        -shouldersDistance / 2 - upperArmLength / 2,
        upperBody.position[1] + upperBodyLength / 2,
      ],
    });
    const upperRightArm = new p2.Body({
      mass: 1,
      position: [
        shouldersDistance / 2 + upperArmLength / 2,
        upperBody.position[1] + upperBodyLength / 2,
      ],
    });
    upperLeftArm.addShape(upperArmShapeLeft);
    upperRightArm.addShape(upperArmShapeRight);
    this.addBody(upperLeftArm);
    this.addBody(upperRightArm);

    // lower arms
    const lowerLeftArm = new p2.Body({
      mass: 1,
      position: [
        upperLeftArm.position[0] - lowerArmLength / 2 - upperArmLength / 2,
        upperLeftArm.position[1],
      ],
    });
    const lowerRightArm = new p2.Body({
      mass: 1,
      position: [
        upperRightArm.position[0] + lowerArmLength / 2 + upperArmLength / 2,
        upperRightArm.position[1],
      ],
    });
    lowerLeftArm.addShape(lowerArmShapeLeft);
    lowerRightArm.addShape(lowerArmShapeRight);
    this.addBody(lowerLeftArm);
    this.addBody(lowerRightArm);

    // Neck joint
    const neckJoint = new p2.RevoluteConstraint(head, upperBody, {
      localPivotA: [0, -headRadius - neckLength / 2],
      localPivotB: [0, upperBodyLength / 2],
    });
    neckJoint.setLimits(-jointLimit, jointLimit);
    this.addConstraint(neckJoint);

    // Knee joints
    const leftKneeJoint = new p2.RevoluteConstraint(
      lowerLeftLeg,
      upperLeftLeg,
      {
        localPivotA: [0, lowerLegLength / 2],
        localPivotB: [0, -upperLegLength / 2],
      }
    );
    const rightKneeJoint = new p2.RevoluteConstraint(
      lowerRightLeg,
      upperRightLeg,
      {
        localPivotA: [0, lowerLegLength / 2],
        localPivotB: [0, -upperLegLength / 2],
      }
    );
    leftKneeJoint.setLimits(-jointLimit, jointLimit);
    rightKneeJoint.setLimits(-jointLimit, jointLimit);
    this.addConstraint(leftKneeJoint);
    this.addConstraint(rightKneeJoint);

    // Hip joints
    const leftHipJoint = new p2.RevoluteConstraint(upperLeftLeg, pelvis, {
      localPivotA: [0, upperLegLength / 2],
      localPivotB: [-shouldersDistance / 2, -pelvisLength / 2],
    });
    const rightHipJoint = new p2.RevoluteConstraint(upperRightLeg, pelvis, {
      localPivotA: [0, upperLegLength / 2],
      localPivotB: [shouldersDistance / 2, -pelvisLength / 2],
    });
    leftHipJoint.setLimits(-jointLimit, jointLimit);
    rightHipJoint.setLimits(-jointLimit, jointLimit);
    this.addConstraint(leftHipJoint);
    this.addConstraint(rightHipJoint);

    // Spine
    const spineJoint = new p2.RevoluteConstraint(pelvis, upperBody, {
      localPivotA: [0, pelvisLength / 2],
      localPivotB: [0, -upperBodyLength / 2],
    });
    spineJoint.setLimits(-jointLimit, jointLimit);
    this.addConstraint(spineJoint);

    // Shoulders
    const leftShoulder = new p2.RevoluteConstraint(upperBody, upperLeftArm, {
      localPivotA: [-shouldersDistance / 2, upperBodyLength / 2],
      localPivotB: [upperArmLength / 2, 0],
    });
    const rightShoulder = new p2.RevoluteConstraint(upperBody, upperRightArm, {
      localPivotA: [shouldersDistance / 2, upperBodyLength / 2],
      localPivotB: [-upperArmLength / 2, 0],
    });
    leftShoulder.setLimits(-jointLimit, jointLimit);
    rightShoulder.setLimits(-jointLimit, jointLimit);
    this.addConstraint(leftShoulder);
    this.addConstraint(rightShoulder);

    // Elbow joint
    const leftElbowJoint = new p2.RevoluteConstraint(
      lowerLeftArm,
      upperLeftArm,
      {
        localPivotA: [lowerArmLength / 2, 0],
        localPivotB: [-upperArmLength / 2, 0],
      }
    );
    const rightElbowJoint = new p2.RevoluteConstraint(
      lowerRightArm,
      upperRightArm,
      {
        localPivotA: [-lowerArmLength / 2, 0],
        localPivotB: [upperArmLength / 2, 0],
      }
    );
    leftElbowJoint.setLimits(-jointLimit, jointLimit);
    rightElbowJoint.setLimits(-jointLimit, jointLimit);
    this.addConstraint(leftElbowJoint);
    this.addConstraint(rightElbowJoint);

    // Create ground
    const planeShape = new p2.Plane();
    const plane = new p2.Body({
      position: [0, 0],
    });
    plane.addShape(planeShape);
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask = BODYPARTS | OTHER;
    this.addBody(plane);
  };

  addBody = (body: p2.Body) => {
    this.world.addBody(body);
    this.bodies.push(body);
  };

  addConstraint = (constraint: p2.Constraint) => {
    this.world.addConstraint(constraint);
    this.constraints.push(constraint);
  };

  step = (t = 1 / 60) => {
    this.time += t;
    this.world.step(t);
    if (!this.head) {
      throw new Error("can't step before create of world");
    }
    this.fitness += this.head.position[1];
  };

  setMomentum = (moments: number[]) => {
    this.constraints.forEach((constraint, i) => {
      constraint.bodyA.angularForce += moments[i];
      constraint.bodyB.angularForce -= moments[i];
    });
  };
}
