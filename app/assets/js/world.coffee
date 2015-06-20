class World
  constructor: (@p2) ->
    @create_world()

    console.log "World created!\nBodies: #{@bodies.length} \nConstrains #{@constraints.length}"

  get_angles: ->
    angles = []
    for body in @bodies
      angle = body.angle % (2*Math.PI);
      if angle < 0
        angle += (2*Math.PI)
      angles.push angle
    angles

  create_world: ->

    p2 = @p2

    shouldersDistance = 0.5
    upperArmLength = 0.4
    lowerArmLength = 0.4
    upperArmSize = 0.2
    lowerArmSize = 0.2
    neckLength = 0.1
    headRadius = 0.25
    upperBodyLength = 0.6
    pelvisLength = 0.4
    upperLegLength = 0.5
    upperLegSize = 0.2
    lowerLegSize = 0.2
    lowerLegLength = 0.5

    world = new p2.World({ gravity: [0,-10]})
    @world = world

    OTHER =     Math.pow(2,1)
    BODYPARTS = Math.pow(2,2)
    GROUND =    Math.pow(2,3)
    OTHER =     Math.pow(2,4)
    bodyPartShapes = [];

    # app = new p2.WebGLRenderer ->
    #   this.setWorld(world);

    headShape =      new p2.Circle(headRadius)
    upperArmShape =  new p2.Rectangle(upperArmLength,upperArmSize)
    lowerArmShape =  new p2.Rectangle(lowerArmLength,lowerArmSize)
    upperBodyShape = new p2.Rectangle(shouldersDistance,upperBodyLength)
    pelvisShape =    new p2.Rectangle(shouldersDistance,pelvisLength)
    upperLegShape =  new p2.Rectangle(upperLegSize,upperLegLength)
    lowerLegShape =  new p2.Rectangle(lowerLegSize,lowerLegLength)

    bodyPartShapes.push(headShape, upperArmShape, lowerArmShape, upperBodyShape, pelvisShape, upperLegShape, lowerLegShape)

    for s, i in bodyPartShapes
      s.collisionGroup = BODYPARTS;
      s.collisionMask =  GROUND|OTHER;

    world.solver.iterations = 100;
    world.solver.tolerance = 0.002;

    @bodies = []

    # Lower legs
    lowerLeftLeg = new p2.Body
      mass: 1
      position: [-shouldersDistance/2,lowerLegLength / 2]

    lowerRightLeg = new p2.Body
      mass: 1
      position: [shouldersDistance/2,lowerLegLength / 2]

    lowerLeftLeg.addShape(lowerLegShape);
    lowerRightLeg.addShape(lowerLegShape);
    world.addBody(lowerLeftLeg);
    world.addBody(lowerRightLeg);
    @bodies.push lowerLeftLeg, lowerRightLeg

    # Upper legs
    upperLeftLeg = new p2.Body
      mass: 1
      position: [-shouldersDistance/2,lowerLeftLeg.position[1]+lowerLegLength/2+upperLegLength / 2]

    upperRightLeg = new p2.Body
      mass: 1
      position: [shouldersDistance/2,lowerRightLeg.position[1]+lowerLegLength/2+upperLegLength / 2],

    upperLeftLeg.addShape(upperLegShape);
    upperRightLeg.addShape(upperLegShape);
    world.addBody(upperLeftLeg);
    world.addBody(upperRightLeg);
    @bodies.push upperLeftLeg, upperRightLeg

    # Pelvis
    pelvis = new p2.Body
      mass: 1
      position: [0, upperLeftLeg.position[1]+upperLegLength/2+pelvisLength/2],

    pelvis.addShape(pelvisShape);
    world.addBody(pelvis);
    @bodies.push pelvis

    # Upper body
    upperBody = new p2.Body
      mass: 1
      position: [0,pelvis.position[1]+pelvisLength/2+upperBodyLength/2],

    upperBody.addShape(upperBodyShape);
    world.addBody(upperBody);
    @bodies.push upperBody

    # Head
    head = new p2.Body
      mass: 1
      position: [0,upperBody.position[1]+upperBodyLength/2+headRadius+neckLength],

    head.addShape(headShape);
    world.addBody(head);
    @bodies.push head

    # Upper arms
    upperLeftArm = new p2.Body
      mass: 1
      position: [-shouldersDistance/2-upperArmLength/2, upperBody.position[1]+upperBodyLength/2],

    upperRightArm = new p2.Body
      mass: 1
      position: [shouldersDistance/2+upperArmLength/2, upperBody.position[1]+upperBodyLength/2],

    upperLeftArm.addShape(upperArmShape);
    upperRightArm.addShape(upperArmShape);
    world.addBody(upperLeftArm);
    world.addBody(upperRightArm);
    @bodies.push upperLeftArm, upperRightArm

    # lower arms
    lowerLeftArm = new p2.Body
      mass: 1
      position: [ upperLeftArm.position[0] - lowerArmLength/2 - upperArmLength/2, upperLeftArm.position[1]],

    lowerRightArm = new p2.Body
      mass: 1
      position: [ upperRightArm.position[0] + lowerArmLength/2 + upperArmLength/2, upperRightArm.position[1]],

    lowerLeftArm.addShape(lowerArmShape);
    lowerRightArm.addShape(lowerArmShape);
    world.addBody(lowerLeftArm);
    world.addBody(lowerRightArm);
    @bodies.push lowerLeftArm, lowerRightArm


    @constraints = []

    # Neck joint
    neckJoint = new p2.RevoluteConstraint head, upperBody,
      localPivotA: [0,-headRadius-neckLength/2]
      localPivotB: [0,upperBodyLength/2]

    neckJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(neckJoint);
    @constraints.push neckJoint

    # Knee joints
    leftKneeJoint = new p2.RevoluteConstraint lowerLeftLeg, upperLeftLeg,
      localPivotA: [0, lowerLegLength/2]
      localPivotB: [0,-upperLegLength/2]

    rightKneeJoint= new p2.RevoluteConstraint lowerRightLeg, upperRightLeg,
      localPivotA: [0, lowerLegLength/2]
      localPivotB:[0,-upperLegLength/2]

    leftKneeJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    rightKneeJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(leftKneeJoint);
    world.addConstraint(rightKneeJoint);
    @constraints.push leftKneeJoint
    @constraints.push rightKneeJoint

    # Hip joints
    leftHipJoint = new p2.RevoluteConstraint upperLeftLeg, pelvis,
      localPivotA: [0, upperLegLength/2]
      localPivotB: [-shouldersDistance/2,-pelvisLength/2]

    rightHipJoint = new p2.RevoluteConstraint upperRightLeg, pelvis,
      localPivotA: [0, upperLegLength/2]
      localPivotB: [shouldersDistance/2,-pelvisLength/2]

    leftHipJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    rightHipJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(leftHipJoint);
    world.addConstraint(rightHipJoint);
    @constraints.push leftHipJoint
    @constraints.push rightHipJoint

    # Spine
    spineJoint = new p2.RevoluteConstraint pelvis, upperBody,
      localPivotA: [0,pelvisLength/2],
      localPivotB: [0,-upperBodyLength/2],

    spineJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(spineJoint);
    @constraints.push spineJoint

    # Shoulders
    leftShoulder = new p2.RevoluteConstraint upperBody, upperLeftArm,
      localPivotA:[-shouldersDistance/2, upperBodyLength/2],
      localPivotB:[upperArmLength/2,0],

    rightShoulder= new p2.RevoluteConstraint upperBody, upperRightArm,
      localPivotA:[shouldersDistance/2,  upperBodyLength/2],
      localPivotB:[-upperArmLength/2,0],

    leftShoulder.setLimits(-Math.PI / 3, Math.PI / 3);
    rightShoulder.setLimits(-Math.PI / 3, Math.PI / 3);
    world.addConstraint(leftShoulder);
    world.addConstraint(rightShoulder);
    @constraints.push leftShoulder
    @constraints.push rightShoulder

    # Elbow joint
    leftElbowJoint = new p2.RevoluteConstraint lowerLeftArm, upperLeftArm,
      localPivotA: [lowerArmLength/2, 0],
      localPivotB: [-upperArmLength/2,0],

    rightElbowJoint= new p2.RevoluteConstraint lowerRightArm, upperRightArm,
      localPivotA:[-lowerArmLength/2,0],
      localPivotB:[upperArmLength/2,0],

    leftElbowJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    rightElbowJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(leftElbowJoint);
    world.addConstraint(rightElbowJoint);
    @constraints.push leftElbowJoint
    @constraints.push rightElbowJoint

    # Create ground
    planeShape = new p2.Plane();
    plane = new p2.Body({ position:[0,-1] });
    plane.addShape(planeShape);
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask =  BODYPARTS|OTHER;
    world.addBody(plane);

  step: ->
    @world.step(1/60);

  set_momentum: (moments) ->
    for constraint, i in @constraints
      constraint.bodyA.angularForce += moments[i]
      constraint.bodyB.angularForce -= moments[i]

define ->
  World
