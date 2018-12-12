function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

function sigmoid_prime(x) {
  return sigmoid(x) * (1 - sigmoid(x))
}

class NeuralNetwork {
  /**
   * Insantiate a neural network, with random weights and biases, with the given amount of layers and nodes.
   *
   * @param {Number} inputNodes The amount of input nodes
   * @param {Array | Number} hiddenLayers An array containing the amount of hidden nodes,
   * for each hidden layer. Or a number if the network only has one hidden layer
   * @param {Number} outputNodes The amount of output nodes
   */
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
   * Calculate the output for the given inputs, using the feed forward algorithm
   * @param {Array} inputs the inputs for the neural network
   */
  predict(inputs) {
    // Convert input array to a matrix
    let input_matrix = Matrix.fromArray(inputs)

    let output_layer = input_matrix

    // Calculate the outputs, using the Feed Forward algorithm.
    for (let i = 0; i < this.weights.length; i++) {
      output_layer = Matrix.multiply(this.weights[i], output_layer)
      output_layer.add(this.biases[i])
      output_layer.map(this.activation_funcs.normal)

      output_layer = output_layer
    }

    return output_layer.toArray()
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
    let node_layers = []
    let node_layers_inactivated = []

    // Feed forward, saving the values for all nodes in each layer
    for (let i = 0; i < this.weights.length; i++) {
      node_layer = Matrix.multiply(this.weights[i], node_layer)
      node_layer.add(this.biases[i])

      node_layers_inactivated.push(node_layer.copy())
      node_layer.map(this.activation_funcs.normal)

      node_layers.push(node_layer.copy())
    }

    // Calculate the output error
    // ERROR = TARGETS - OUTPUTS

    let previous_errors

    // Go through the layers of the network, starting at the output nodes,
    // and moving backwards through the hidden nodes to the input nodes.
    for (let i = node_layers.length - 1; i >= 0; i--) {
      let current_nodes = node_layers[i]
      let next_nodes

      if (i > 0) {
        next_nodes = node_layers[i - 1]
      } else {
        next_nodes = inputs
      }

      let output_errors
      if (i == node_layers.length - 1) {
        // last output ERROR = TARGETS - OUTPUTS
        output_errors = Matrix.subtract(targets, current_nodes)
      } else {
        let previous_weights_t = Matrix.transpose(this.weights[i + 1])

        // Each weight share its portion of the error
        output_errors = Matrix.multiply(previous_weights_t, previous_errors)
      }

      previous_errors = output_errors

      // Calculate output gradients
      let output_gradients = Matrix.map(
        node_layers_inactivated[i],
        this.activation_funcs.derived
      )
      output_gradients.element_wise_multiply(output_errors)
      output_gradients.multiply(this.learning_rate)

      // Calculate deltas
      let next_nodes_t = Matrix.transpose(next_nodes)

      // Previous layers outputs, multiplied with the direction we want to push the current layers outputs.
      // The result, is the direction we want to push each weight between theese layers.
      let weight_deltas = Matrix.multiply(output_gradients, next_nodes_t)

      this.weights[i].add(weight_deltas)
      this.biases[i].add(output_gradients)
    }
  }
}
