function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

function sigmoid_prime(x) {
  return sigmoid(x) * (1 - sigmoid(x))
}

class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes
    this.hiddenNodes = hiddenNodes
    this.outputNodes = outputNodes

    this.activation_funcs = {
      normal: sigmoid,
      derived: sigmoid_prime,
    }
    this.learning_rate = 0.1

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
    hidden.map(this.activation_funcs.normal)

    // Generating the output's outputs
    let output = Matrix.multiply(this.weights_ho, hidden)
    output.add(this.bias_o)
    output.map(this.activation_funcs.normal)

    // Sending back the results
    return output.toArray()
  }

  /**
   * Train the neural network using back propagation
   * @param {Array} inputs an array of inputs matching the length of input nodes
   * @param {Array} targets an array of targets matching the length of target nodes
   */
  train(inputs, targets) {
    // Convert arrays to matrices
    targets = Matrix.fromArray(targets)
    inputs = Matrix.fromArray(inputs)

    // Feed forward
    // Generating the hidden outputs
    let hidden = Matrix.multiply(this.weights_ih, inputs)
    hidden.add(this.bias_h)
    let hidden_raw = hidden.copy()
    hidden.map(this.activation_funcs.normal)

    // Generating the output's outputs
    let outputs = Matrix.multiply(this.weights_ho, hidden)
    outputs.add(this.bias_o)
    let outputs_raw = outputs.copy()
    outputs.map(this.activation_funcs.normal)

    // Calculate the output error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs)

    // Calculate output gradients
    let output_gradients = Matrix.map(
      outputs_raw,
      this.activation_funcs.derived
    )
    output_gradients.element_wise_multiply(output_errors)
    output_gradients.multiply(this.learning_rate)

    // Calculate hidden -> output deltas
    let hidden_t = Matrix.transpose(hidden)
    let weight_ho_deltas = Matrix.multiply(output_gradients, hidden_t)

    this.weights_ho.add(weight_ho_deltas)
    this.bias_o.add(output_gradients)

    // Calculate the hidden layer errors
    let weights_ho_trans = Matrix.transpose(this.weights_ho)
    let hidden_errors = Matrix.multiply(weights_ho_trans, output_errors)

    // Calculate hidden gradients
    let hidden_gradients = Matrix.map(hidden_raw, this.activation_funcs.derived)
    hidden_gradients.element_wise_multiply(hidden_errors)
    hidden_gradients.multiply(this.learning_rate)

    // Calculate input -> hidden deltas
    let inputs_t = Matrix.transpose(inputs)
    let weight_ih_deltas = Matrix.multiply(hidden_gradients, inputs_t)

    this.weights_ih.add(weight_ih_deltas)
    this.bias_h.add(hidden_gradients)
  }
}
