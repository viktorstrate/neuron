let inputNodesField
let outputNodesField
let hiddenLayersField

let trainingDataContainer

function refreshUI() {
  removeElements()

  createButton('Start training').mousePressed(() => {
    training = true
  })
  createButton('Stop training').mousePressed(() => {
    training = false
  })

  createElement('br')
  createElement('br')

  createSpan('Learning Rate:')
  let lr_slider = createSlider(0, 0.5, 0.1, 0.01)
  let lr_label = null
  lr_slider.changed(() => {
    nn.learning_rate = lr_slider.value()
    lr_label.html(lr_slider.value())
  })

  lr_label = createSpan(lr_slider.value())

  createElement('br')
  createElement('br')

  createSpan('Input nodes:')
  inputNodesField = createInput(nn.inputNodes)

  createSpan('Hidden layers (seperated by comma):')
  hiddenLayersField = createInput(
    nn.hiddenLayers.reduce((prev, curr) => prev + ', ' + curr, '').substr(2)
  )

  createSpan('Output nodes:')
  outputNodesField = createInput(nn.outputNodes)

  createElement('br')
  createElement('br')

  createButton('Update neural network nodes').mousePressed(() => {
    if (!confirm('This will delete the current neural network')) {
      return
    }

    applyNetwork()
  })

  createElement('br')
  createElement('br')

  createElement('h2').html('Predict')
  let inputs = []
  for (let i = 0; i < nn.inputNodes; i++) {
    createSpan('Input #' + (i + 1) + ':')
    inputs.push(createInput())
  }

  createElement('br')
  createElement('br')

  let predictBtn = createButton('Predict')
  let guessLabel = createSpan('Guess').style('margin', '0 12px')

  predictBtn.mousePressed(() => {
    let guesses = nn.predict(inputs.map(x => x.value()))

    displayGuesses = guesses
      .map(x => floor(x * 1000) / 1000)
      .reduce((prev, curr) => prev + ', ' + curr, '')
      .substr(2)

    guessLabel.html('Guess: ' + displayGuesses)
  })

  createElement('br')
  createElement('br')

  createElement('h2').html('Training data')
  createButton('Clear trainging data').mousePressed(() => {
    trainingData = []
    refreshUI()
  })

  createElement('br')
  createElement('br')

  let dataInputs = []
  for (let i = 0; i < nn.inputNodes; i++) {
    createSpan('Input #' + (i + 1) + ':')
    dataInputs.push(createInput())
  }

  createSpan('|').style('margin-right', '12px')

  let dataOutputs = []
  for (let i = 0; i < nn.outputNodes; i++) {
    createSpan('Output #' + (i + 1) + ':')
    dataOutputs.push(createInput())
  }

  createSpan('|').style('margin-right', '12px')

  createButton('Add data').mousePressed(() => {
    let inputs = dataInputs.map(x => Number(x.value()))
    let outputs = dataOutputs.map(x => Number(x.value()))

    for (let output of outputs) {
      if (output > 1) {
        alert('Output must be between 0 and 1')
        return
      }
    }

    for (let input of dataInputs) {
      input.value('')
    }

    for (let output of dataOutputs) {
      output.value('')
    }

    let data = [inputs, outputs]

    trainingData.push(data)
    addTrainingDataRow(data)
  })

  createElement('br')
  createElement('br')

  trainingDataContainer = createDiv()
  for (let i = 0; i < trainingData.length; i++) {
    addTrainingDataRow(trainingData[i])
  }

  createElement('br')
  createElement('br')

  let exportBtn = createButton('Export state')
  let importBtn = createButton('Import state')

  createElement('br')

  let outputArea = createElement('textarea')

  exportBtn.mousePressed(() => {
    outputArea.value(serializeState())
  })

  importBtn.mousePressed(() => {
    parseState(outputArea.value())
  })
}

function addTrainingDataRow(data) {
  let row = createDiv()
  row.style('background-color', '#eee')
  row.style('padding', '6px 32px')
  row.style('margin', '6px auto')
  row.style('width', '300px')

  row.parent(trainingDataContainer)

  let inputs = createSpan(
    'Inputs: ' +
      data[0].reduce((prev, curr) => prev + ', ' + curr, '').substr(2)
  )
  inputs.style('margin-right', '18px')
  inputs.parent(row)

  let outputs = createSpan(
    'Outputs: ' +
      data[1].reduce((prev, curr) => prev + ', ' + curr, '').substr(2)
  )
  outputs.style('margin-right', '18px')
  outputs.parent(row)

  let remove = createButton('Remove')
  remove.parent(row)
  remove.mousePressed(() => {
    let index
    let children = trainingDataContainer.child()
    for (let i = 0; i < children.length; i++) {
      if (children[i] == row.elt) {
        index = i
      }
    }

    trainingData.splice(index, 1)
    row.remove()
  })
}

function applyNetwork() {
  let inputs = Number(inputNodesField.value())
  let outputs = Number(outputNodesField.value())

  if (inputs !== nn.inputNodes || outputs !== nn.outputNodes) {
    trainingData = []
  }

  let hiddenLayers = hiddenLayersField
    .value()
    .split(',')
    .map(x => Number(x))

  nn = new NeuralNetwork(inputs, hiddenLayers, outputs)
  refreshUI()
  updateNetworkStructure()
}
