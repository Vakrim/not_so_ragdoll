class World {
  constructor(p2) {
    this.p2 = p2;
    this.bodies = [];
    this.constraints = [];
    this.createWorld();
    this._fitness = 0;
    this.time = 0;
  }

  getAngles = () => {
    const angles = [];
    this.bodies.map(body => {
      let angle = body.angle % (2 * Math.PI);
      if (angle < 0) angle += 2 * Math.PI;
      angles.push(angle);
    });
    angles.push(1, Math.sin(this.time * 2 * Math.PI));
    return angles;
  };

  createWorld = () => {
    const p2 = this.p2;

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
      bodyPartShapes = [];

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

    for (var i = 0; i < bodyPartShapes.length; i++) {
      var s = bodyPartShapes[i];
      s.collisionGroup = BODYPARTS;
      s.collisionMask = GROUND | OTHER;
    }

    const world = (this.world = new p2.World({
      gravity: [0, -10],
    }));

    world.solver.iterations = 100;
    world.solver.tolerance = 0.002;

    // Lower legs
    var lowerLeftLeg = new p2.Body({
      mass: 1,
      position: [-shouldersDistance / 2, lowerLegLength / 2],
    });
    var lowerRightLeg = new p2.Body({
      mass: 1,
      position: [shouldersDistance / 2, lowerLegLength / 2],
    });
    lowerLeftLeg.addShape(lowerLegShapeLeft);
    lowerRightLeg.addShape(lowerLegShapeRight);
    this.addBody(lowerLeftLeg);
    this.addBody(lowerRightLeg);

    // Upper legs
    var upperLeftLeg = new p2.Body({
      mass: 1,
      position: [
        -shouldersDistance / 2,
        lowerLeftLeg.position[1] + lowerLegLength / 2 + upperLegLength / 2,
      ],
    });
    var upperRightLeg = new p2.Body({
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
    var pelvis = new p2.Body({
      mass: 1,
      position: [
        0,
        upperLeftLeg.position[1] + upperLegLength / 2 + pelvisLength / 2,
      ],
    });
    pelvis.addShape(pelvisShape);
    this.addBody(pelvis);

    // Upper body
    var upperBody = new p2.Body({
      mass: 1,
      position: [
        0,
        pelvis.position[1] + pelvisLength / 2 + upperBodyLength / 2,
      ],
    });
    upperBody.addShape(upperBodyShape);
    this.addBody(upperBody);

    // Head
    var head = new p2.Body({
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
    var upperLeftArm = new p2.Body({
      mass: 1,
      position: [
        -shouldersDistance / 2 - upperArmLength / 2,
        upperBody.position[1] + upperBodyLength / 2,
      ],
    });
    var upperRightArm = new p2.Body({
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
    var lowerLeftArm = new p2.Body({
      mass: 1,
      position: [
        upperLeftArm.position[0] - lowerArmLength / 2 - upperArmLength / 2,
        upperLeftArm.position[1],
      ],
    });
    var lowerRightArm = new p2.Body({
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
    var neckJoint = new p2.RevoluteConstraint(head, upperBody, {
      localPivotA: [0, -headRadius - neckLength / 2],
      localPivotB: [0, upperBodyLength / 2],
    });
    neckJoint.setLimits(-jointLimit, jointLimit);
    this.addConstraint(neckJoint);

    // Knee joints
    var leftKneeJoint = new p2.RevoluteConstraint(lowerLeftLeg, upperLeftLeg, {
      localPivotA: [0, lowerLegLength / 2],
      localPivotB: [0, -upperLegLength / 2],
    });
    var rightKneeJoint = new p2.RevoluteConstraint(
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
    var leftHipJoint = new p2.RevoluteConstraint(upperLeftLeg, pelvis, {
      localPivotA: [0, upperLegLength / 2],
      localPivotB: [-shouldersDistance / 2, -pelvisLength / 2],
    });
    var rightHipJoint = new p2.RevoluteConstraint(upperRightLeg, pelvis, {
      localPivotA: [0, upperLegLength / 2],
      localPivotB: [shouldersDistance / 2, -pelvisLength / 2],
    });
    leftHipJoint.setLimits(-jointLimit, jointLimit);
    rightHipJoint.setLimits(-jointLimit, jointLimit);
    this.addConstraint(leftHipJoint);
    this.addConstraint(rightHipJoint);

    // Spine
    var spineJoint = new p2.RevoluteConstraint(pelvis, upperBody, {
      localPivotA: [0, pelvisLength / 2],
      localPivotB: [0, -upperBodyLength / 2],
    });
    spineJoint.setLimits(-jointLimit, jointLimit);
    this.addConstraint(spineJoint);

    // Shoulders
    var leftShoulder = new p2.RevoluteConstraint(upperBody, upperLeftArm, {
      localPivotA: [-shouldersDistance / 2, upperBodyLength / 2],
      localPivotB: [upperArmLength / 2, 0],
    });
    var rightShoulder = new p2.RevoluteConstraint(upperBody, upperRightArm, {
      localPivotA: [shouldersDistance / 2, upperBodyLength / 2],
      localPivotB: [-upperArmLength / 2, 0],
    });
    leftShoulder.setLimits(-jointLimit, jointLimit);
    rightShoulder.setLimits(-jointLimit, jointLimit);
    this.addConstraint(leftShoulder);
    this.addConstraint(rightShoulder);

    // Elbow joint
    var leftElbowJoint = new p2.RevoluteConstraint(lowerLeftArm, upperLeftArm, {
      localPivotA: [lowerArmLength / 2, 0],
      localPivotB: [-upperArmLength / 2, 0],
    });
    var rightElbowJoint = new p2.RevoluteConstraint(
      lowerRightArm,
      upperRightArm,
      {
        localPivotA: [-lowerArmLength / 2, 0],
        localPivotB: [upperArmLength / 2, 0],
      }
    );
    leftElbowJoint.setLimits(-jointLimit, jointLimit);
    rightElbowJoint.setLimits(
      -jointLimit,
      jointLimit
    );
    this.addConstraint(leftElbowJoint);
    this.addConstraint(rightElbowJoint);

    // Create ground
    var planeShape = new p2.Plane();
    var plane = new p2.Body({
      position: [0, 0],
    });
    plane.addShape(planeShape);
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask = BODYPARTS | OTHER;
    this.addBody(plane);
  };

  addBody = body => {
    this.world.addBody(body);
    this.bodies.push(body);
  };

  addConstraint = constraint => {
    this.world.addConstraint(constraint);
    this.constraints.push(constraint);
  };

  step = (t = 1 / 60) => {
    this.time += t;
    this.world.step(t);
    this._fitness += this.head.position[1];
  };

  setMomentum = moments => {
    this.constraints.forEach((constraint, i) => {
      constraint.bodyA.angularForce += moments[i];
      constraint.bodyB.angularForce -= moments[i];
    });
  };

  fitness = () => {
    return this._fitness;
  };
}

export default World;
