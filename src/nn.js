function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes
    this.hiddenNodes = hiddenNodes
    this.outputNodes = outputNodes

    // Weights between inputs and the hidden
    this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes)
    // Weights between hidden and inputs
    this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes)

    this.weights_ih.randomize()
    this.weights_ho.randomize()

    // The bias weights for the hidden and output layer
    this.bias_h = new Matrix(this.hiddenNodes, 1)
    this.bias_o = new Matrix(this.outputNodes, 1)

    this.bias_h.randomize()
    this.bias_o.randomize()
  }

  /**
   * Calculate the output for the following inputs, using the feed forward algorithm
   * @param {Array} inputs the inputs for the neural network
   */
  feedforward(inputs) {
    let input_matrix = Matrix.fromArray(inputs)

    // Generating the hidden outputs
    let hidden = Matrix.multiply(this.weights_ih, input_matrix)
    hidden.add(this.bias_h)
    hidden.map(sigmoid)

    // Generating the output's outputs
    let output = Matrix.multiply(this.weights_ho, hidden)
    output.add(this.bias_o)
    output.map(sigmoid)

    // Sending back the results
    return output.toArray()
  }

  train(inputs, targets) {
    let outputs = this.feedforward(inputs)

    // Convert arrays to matrices
    outputs = Matrix.fromArray(outputs)
    targets = Matrix.fromArray(targets)

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs)

    let weights_ho_trans = Matrix.transpose(this.weights_ho)

    // NOTE: To add more layers, make a loop and repeat this
    let hidden_errors = Matrix.multiply(weights_ho_trans, output_errors)

    // outputs.print()
    // targets.print()
    // error.print()
  }
}
