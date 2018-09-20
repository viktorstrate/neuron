function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

function sigmoid_prime(x) {
  return sigmoid(x) * (1 - sigmoid(x))
}

class NeuralNetwork {
  constructor(inputNodes, hiddenLayers, outputNodes) {
    if (typeof hiddenLayers === 'number') {
      hiddenLayers = [hiddenLayers]
    }

    this.inputNodes = inputNodes
    this.hiddenLayers = hiddenLayers
    this.outputNodes = outputNodes

    this.learning_rate = 0.1
    this.activation_funcs = {
      normal: sigmoid,
      derived: sigmoid_prime,
    }

    // Weights
    this.weights = []
    this.weights.push(new Matrix(this.hiddenLayers[0], this.inputNodes))

    for (let i = 0; i < this.hiddenLayers.length - 1; i++) {
      this.weights.push(new Matrix(hiddenLayers[i + 1], hiddenLayers[i]))
    }

    this.weights.push(
      new Matrix(outputNodes, this.hiddenLayers[this.hiddenLayers.length - 1])
    )

    for (let weight of this.weights) {
      weight.randomize()
    }

    // Biases
    this.biases = []

    for (let weight of this.weights) {
      let bias = new Matrix(weight.rows, 1)
      bias.randomize()

      this.biases.push(bias)
    }
  }

  /**
   * Calculate the output for the following inputs, using the feed forward algorithm
   * @param {Array} inputs the inputs for the neural network
   */
  feedforward(inputs) {
    let input_matrix = Matrix.fromArray(inputs)

    let node_layer = input_matrix

    for (let i = 0; i < this.weights.length; i++) {
      node_layer = Matrix.multiply(this.weights[i], node_layer)
      node_layer.add(this.biases[i])
      node_layer.map(this.activation_funcs.normal)

      node_layer = node_layer
    }

    return node_layer.toArray()
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
    let node_layer = inputs
    let layers = []
    let layers_inactivated = []

    for (let i = 0; i < this.weights.length; i++) {
      node_layer = Matrix.multiply(this.weights[i], node_layer)
      node_layer.add(this.biases[i])

      layers_inactivated.push(node_layer.copy())
      node_layer.map(this.activation_funcs.normal)

      layers.push(node_layer.copy())
    }

    // Calculate the output error
    // ERROR = TARGETS - OUTPUTS

    let previous_nodes = targets

    for (let i = layers.length - 1; i > 0; i--) {
      let current_nodes = layers[i]

      let output_errors = Matrix.subtract(previous_nodes, current_nodes)

      // Calculate output gradients
      let output_gradients = Matrix.map(
        layers_inactivated[i],
        this.activation_funcs.derived
      )
      output_gradients.element_wise_multiply(output_errors)
      output_gradients.multiply(this.learning_rate)

      // Calculate deltas
      let current_nodes_t = Matrix.transpose(current_nodes)
      let weight_deltas = Matrix.multiply(output_gradients, current_nodes_t)

      this.weights[i].add(weight_deltas)
      this.biases[i].add(output_gradients)
    }

    // ------------------------------------

    // // Feed forward
    // // Generating the hidden outputs
    // let hidden = Matrix.multiply(this.weights_ih, inputs)
    // hidden.add(this.bias_h)
    // let hidden_raw = hidden.copy()
    // hidden.map(this.activation_funcs.normal)

    // // Generating the output's outputs
    // let outputs = Matrix.multiply(this.weights_ho, hidden)
    // outputs.add(this.bias_o)
    // let outputs_raw = outputs.copy()
    // outputs.map(this.activation_funcs.normal)

    // // Calculate the output error
    // // ERROR = TARGETS - OUTPUTS
    // let output_errors = Matrix.subtract(targets, outputs)

    // // Calculate output gradients
    // let output_gradients = Matrix.map(
    //   outputs_raw,
    //   this.activation_funcs.derived
    // )
    // output_gradients.element_wise_multiply(output_errors)
    // output_gradients.multiply(this.learning_rate)

    // // Calculate hidden -> output deltas
    // let hidden_t = Matrix.transpose(hidden)
    // let weight_ho_deltas = Matrix.multiply(output_gradients, hidden_t)

    // this.weights_ho.add(weight_ho_deltas)
    // this.bias_o.add(output_gradients)

    // // Calculate the hidden layer errors
    // let weights_ho_trans = Matrix.transpose(this.weights_ho)
    // let hidden_errors = Matrix.multiply(weights_ho_trans, output_errors)

    // // Calculate hidden gradients
    // let hidden_gradients = Matrix.map(hidden_raw, this.activation_funcs.derived)
    // hidden_gradients.element_wise_multiply(hidden_errors)
    // hidden_gradients.multiply(this.learning_rate)

    // // Calculate input -> hidden deltas
    // let inputs_t = Matrix.transpose(inputs)
    // let weight_ih_deltas = Matrix.multiply(hidden_gradients, inputs_t)

    // this.weights_ih.add(weight_ih_deltas)
    // this.bias_h.add(hidden_gradients)
  }
}
