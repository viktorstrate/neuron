let nn

let training = false

let trainingData = [[[0, 0], [0]], [[1, 1], [0]], [[1, 0], [1]], [[0, 1], [1]]]

let errors = []
let averageErrors = []
let highestError = 0

const NETWORK_PADDING = 30

function setup() {
  nn = new NeuralNetwork(2, [3, 3], 1)

  updateNetworkStructure()
  refreshUI()
}

function draw() {
  background('#f0f3f4')
  drawErrorGraph()
  drawNetwork()

  fill(0)
  noStroke()
  text(training ? 'Training' : 'Not training', 10, height - 10)
  let displayError =
    errors.reduce((prev, curr) => prev + curr, 0) / errors.length
  displayError = floor(displayError * 1000000) / 1000000
  text('Error: ' + displayError, width - 100, height - 10)

  if (training) {
    if (trainingData.length === 0) {
      training = false
      alert('No training data provided, please add some and try again')
      return
    }

    for (let i = 0; i < 100; i++) {
      let data = random(trainingData)
      nn.train(data[0], data[1])
    }

    let data = random(trainingData)
    let prediction = nn.predict(data[0])
    let error = 0

    for (let i = 0; i < prediction.length; i++) {
      error += data[1][i] - prediction[i]
    }

    errors.push(error)
    if (errors.length > 100) {
      errors.splice(0, 1)
    }

    let newAverage =
      errors.reduce((prev, curr) => prev + curr, 0) / errors.length
    averageErrors.push(newAverage)
    if (averageErrors.length > 100) {
      averageErrors.splice(0, 1)
    }

    if (error > highestError) {
      highestError = error
    }
  }
}

function getNetworkLayers() {
  let networkLayers = [nn.inputNodes]
  let mostNodesInLayer = 0
  for (let layer of nn.hiddenLayers) {
    networkLayers.push(layer)

    if (layer > mostNodesInLayer) {
      mostNodesInLayer = layer
    }
  }
  networkLayers.push(nn.outputNodes)

  return networkLayers
}

function updateNetworkStructure() {
  resizeCanvas(
    getNetworkLayers().length * 100 + NETWORK_PADDING * 2 - 50,
    getNetworkLayers().reduce((prev, curr) => max(prev, curr), 0) * 50 +
      NETWORK_PADDING * 2
  )
}

function drawErrorGraph() {
  fill('#e8c2c2')
  noStroke()

  for (let i = 0; i < errors.length; i++) {
    let x = width - 100 + i
    let y = height - (100 * abs(averageErrors[i])) / highestError
    rect(x, y, 1, height - y)
  }
}
