class World
  constructor: (@Matter) ->
    @Engine = @Matter.Engine
    @World = @Matter.World
    @Bodies = @Matter.Bodies
    @Body = @Matter.Body
    @Constraint = @Matter.Constraint
    @create_world()

  create_world: ->
    @engine = @Engine.create document.body

    @create_raggdoll(400, 400)

    ground = @Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
    @World.add(@engine.world, [ground])

    @engine.world.gravity.y = .5

    @Engine.run(@engine)

  create_raggdoll: (cx, cy) ->

    groupId = @Body.nextGroupId()

    default_options =
      restitution: 1
      friction: 0.9
      density: 0.2
      # groupId: groupId

    head = @Bodies.rectangle(cx     , cy - 45, 15, 20, default_options)
    body = @Bodies.rectangle(cx     , cy     , 30, 60, default_options)
    lua =  @Bodies.rectangle(cx - 25, cy - 10, 10, 35, default_options)
    lla =  @Bodies.rectangle(cx - 25, cy + 30, 10, 35, default_options)
    rua =  @Bodies.rectangle(cx + 25, cy - 10, 10, 35, default_options)
    rla =  @Bodies.rectangle(cx + 25, cy + 30, 10, 35, default_options)
    lul =  @Bodies.rectangle(cx - 10, cy + 55, 10, 35, default_options)
    lll =  @Bodies.rectangle(cx - 10, cy + 95, 10, 35, default_options)
    rul =  @Bodies.rectangle(cx + 10, cy + 55, 10, 35, default_options)
    rll =  @Bodies.rectangle(cx + 10, cy + 95, 10, 35, default_options)

    @World.add(@engine.world, [head, body, lua, lla, rua, rla, lul, lll, rul, rll])

    constrs = []
    constrs.push @create_hinge( body, head, {x: 0,   y: -35 })
    constrs.push @create_hinge( body, lua , {x: -25, y: -25 })
    constrs.push @create_hinge( lua , lla , {x: 0,   y: 20  })
    constrs.push @create_hinge( body, rua , {x: 25,  y: -25 })
    constrs.push @create_hinge( rua , rla , {x: 0,   y: 20  })
    constrs.push @create_hinge( body, lul , {x: -10, y: 30  })
    constrs.push @create_hinge( lul , lll , {x: 0,   y: 20  })
    constrs.push @create_hinge( body, rul , {x: 10, y: 30  })
    constrs.push @create_hinge( rul , rll , {x: 0,   y: 20  })


    @World.add(@engine.world, constrs)

  create_hinge: (bodyA, bodyB, pointA) ->
    pointB =
      x: - bodyB.position.x + bodyA.position.x + pointA.x
      y: - bodyB.position.y + bodyA.position.y + pointA.y

    pointB =
      x: (pointB.x) * 0
      y: (pointB.y) * 0

    pointA =
      x: pointA.x * 0.0
      y: pointA.y * 0.0

    @Constraint.create
      bodyA: bodyA
      pointA: pointA
      bodyB: bodyB
      pointB: pointB
      stiffness: 0.5

define ->
  World
