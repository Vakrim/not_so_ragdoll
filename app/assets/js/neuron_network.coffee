class NeuronNetwork
  constructor:  ->

  set_input: (i) ->
    @inputs = i

  set_output_size: (n) ->
    @output_size = n

  set_random_weights: ->
    @weights = Array(@inputs.length * @output_size)
    for weight in @weights
      weight = (Math.random() - 0.5) *5

  index_of_weight: (input_n, output_n) ->
    input_n + output_n * @inputs.length

  output: ->
    outputs = Array(@output_size)
    for output, output_i in @outputs
      output = 0
      for input, input_i in @inputs
        output = @weights[@index_of_weight(input_i. output_i)] * input
    outputs

define ->
  NeuronNetwork
