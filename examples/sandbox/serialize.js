function serializeState() {
  let state = {
    nn: [nn.inputNodes, nn.hiddenLayers, nn.outputNodes],
    trainingData: trainingData,
  }

  return JSON.stringify(state)
}

function parseState(state) {
  state = JSON.parse(state)
  nn = new NeuralNetwork(state.nn[0], state.nn[1], state.nn[2])
  trainingData = state.trainingData
  refreshUI()
  updateNetworkStructure()
}
