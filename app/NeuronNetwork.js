import _ from 'lodash';

class NeuronNetwork {
  static weightLength = 0;
  static outputSize = 0;

  static setWeightLength(input, outputSize) {
    this.outputSize = outputSize;
    this.weightLength = outputSize * input.length;
  }

  setInput(i) {
    this.inputs = i;
  }

  setRandomWeights() {
    this.setZeroWeights();
    this.weights = this.weights.map(() => (Math.random() - 0.5) * 3);
    return this.weights;
  }

  setZeroWeights() {
    this.weights = _.fill(Array(NeuronNetwork.weightLength), 0);
    return this.weights;
  }

  setWeights(w) {
    this.weights = w;
  }

  getWeights() {
    this.weights;
  }

  indexOfWeight(inputN, outputN) {
    return inputN + outputN * this.inputs.length;
  }

  output() {
    const outputs = Array(NeuronNetwork.outputSize);
    outputs.forEach((output, outputIndex) => {
      outputs[outputIndex] = 0;
      this.inputs.forEach((input, inputIndex) => {
        outputs[outputIndex] +=
          this.weights[this.indexOfWeight(inputIndex, outputIndex)] * input;
      });
    });
    return outputs;
  }
}

export default NeuronNetwork;
