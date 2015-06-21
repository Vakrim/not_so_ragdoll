class NeuronNetwork
  @weight_length: 0
  @output_size: 0
  klass: @

  constructor:  ->

  set_input: (i) ->
    @inputs = i
    @

  set_random_weights: ->
    @weights = Array(@klass.weight_length)
    for weight, i in @weights
      @weights[i] = (Math.random() - 0.5) * 3
    @weights

  set_zero_weights: ->
    @weights = Array(@klass.weight_length)
    for weight, i in @weights
      @weights[i] = 0
    @weights

  set_weights: (w) ->
    @weights = w

  get_weights: ->
    @weights

  index_of_weight: (input_n, output_n) ->
    input_n + output_n * @inputs.length

  output: ->
    outputs = Array(@klass.output_size)
    for output, output_i in outputs
      outputs[output_i] = 0
      for input, input_i in @inputs
        outputs[output_i] += @weights[@index_of_weight(input_i, output_i)] * input
    outputs

  @set_weight_length: (input, output_size) ->
    @output_size = output_size
    @weight_length = output_size * input.length

define ->
  NeuronNetwork
