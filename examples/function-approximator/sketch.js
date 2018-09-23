let nn
let functionInput = 'x**2'
let training = false
let trainingSpeed = 100

let startX = -5
let endX = 5
let startY = -2
let endY = 10

let errors = []
let highestError = 0

let inputNodesField
let outputNodesField
let hiddenLayersField

function setup() {
  createCanvas(400, 400)
  background(200)
  noLoop()

  nn = new NeuralNetwork(1, [5, 5], 1)

  createSpan('Learning Rate:')
  let lr_slider = createSlider(0, 0.2, 0.05, 0.001)
  let lr_label = createSpan(lr_slider.value())
  lr_slider.changed(() => {
    nn.learning_rate = lr_slider.value()
    lr_label.html(lr_slider.value())
  })

  createElement('br')
  createElement('br')

  createSpan('Training Speed:')
  let traindingSpeedSlider = createSlider(1, 1000, 100, 1).changed(() => {
    trainingSpeed = traindingSpeedSlider.value()
  })

  createElement('br')
  createElement('br')

  createButton('Start training').mousePressed(() => {
    training = true
    loop()
  })
  createButton('Stop training').mousePressed(() => {
    training = false
    noLoop()
  })

  createElement('br')
  createElement('br')

  createSpan('Function:')
  let funcInputElm = createInput(functionInput)
  funcInputElm.style('width', '200px')
  funcInputElm.changed(() => {
    functionInput = funcInputElm.value()
    draw()
  })

  createElement('br')
  createElement('br')

  createSpan('X range:')
  let startXElm = createInput(startX).changed(() => {
    startX = Number(startXElm.value())
    draw()
  })
  let endXElm = createInput(endX).changed(() => {
    endX = Number(endXElm.value())
    draw()
  })

  createSpan('Y range:')
  let startYElm = createInput(startY).changed(() => {
    startY = Number(startYElm.value())
    draw()
  })
  let endYElm = createInput(endY).changed(() => {
    endY = Number(endYElm.value())
    draw()
  })

  createElement('br')
  createElement('br')

  createSpan('Hidden layers (seperated by comma):')
  hiddenLayersField = createInput(
    nn.hiddenLayers.reduce((prev, curr) => prev + ', ' + curr, '').substr(2)
  )

  createButton('Update neural network nodes').mousePressed(applyNetwork)
}

function applyNetwork() {
  let hiddenLayers = hiddenLayersField
    .value()
    .split(',')
    .map(x => Number(x))

  nn = new NeuralNetwork(1, hiddenLayers, 1)
  draw()
}

function draw() {
  background('#f0f3f4')

  stroke('#cddee1')

  let x = map(0, startX, endX, 0, width)
  let y = map(0, startY, endY, height, 0)

  line(x, 0, x, height)
  line(0, y, width, y)

  // Real function
  stroke('gray')
  noFill()
  beginShape()

  for (let i = 0; i < 100; i++) {
    x = map(i, 0, 100, startX, endX)
    let y = eval(functionInput)

    let screenX = map(x, startX, endX, 0, width)
    let screenY = map(y, startY, endY, height, 0)

    vertex(screenX, screenY)
  }
  endShape()

  // Trained function
  stroke('red')
  beginShape()

  for (let i = 0; i < 100; i++) {
    x = map(i, 0, 100, startX, endX)

    let y = nn.predict([x])

    // Revert normalization
    y = y * (endY - startY) + startY

    let screenX = map(x, startX, endX, 0, width)
    let screenY = map(y, startY, endY, height, 0)

    vertex(screenX, screenY)
  }
  endShape()

  // Training
  if (training) {
    for (let i = 0; i < trainingSpeed; i++) {
      let x = random(startX, endX)
      let y = eval(functionInput)

      if (y > endY || y < startY) {
        continue
      }

      // Normalize
      y = (y - startY) / (endY - startY)

      // Calculate error
      if (i === 0) {
        let prediction = nn.predict([x])
        let error = y - prediction
        errors.push(error)
        if (errors.length > 100) {
          errors.splice(0, 1)
        }

        if (error > highestError) {
          highestError = error
        }
      }

      nn.train([x], [y])
    }
  }

  noStroke()

  fill(0)
  text(training ? 'Training' : 'Not Training', 12, height - 12)

  let error = errors.reduce((prev, curr) => prev + curr, 0) / errors.length
  error = floor(error * 100000) / 100000
  text('Error: ' + error, width - 90, height - 12)

  textFont('times')
  text('f(x) = ' + functionInput.replace('**', '^'), 10, 20)
}
