let nn
let avaliableLabels = ['red', 'green', 'blue', 'coral', 'orange', 'slategray']
let labels = ['red', 'green', 'blue']
let label = labels[0]

let training = false

const RESOLUTION = 25

let points = []

let hiddenLayersField
let inputField

function setup() {
  nn = new NeuralNetwork(2, [5, 5], labels.length)

  createCanvas(400, 400)

  updateUI()
}

function updateUI() {
  removeElements()

  createSpan('Select point label:')

  for (let c of labels) {
    createButton(c).mousePressed(() => {
      label = c
    })
  }

  createElement('br')
  createElement('br')

  createButton('Start Training').mousePressed(() => {
    training = true
  })
  createButton('Stop Training').mousePressed(() => {
    training = false
  })

  createElement('br')
  createElement('br')

  createSpan('Learning Rate:')
  let lr_slider = createSlider(0, 0.2, 0.05, 0.001)
  let lr_label = createSpan(lr_slider.value())
  lr_slider.changed(() => {
    nn.learning_rate = lr_slider.value()
    lr_label.html(lr_slider.value())
  })

  createElement('br')
  createElement('br')

  createSpan('Inputs:')
  inputField = createInput(labels.length)

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

  let inputs = Number(inputField.value())
  inputs = constrain(inputs, 1, avaliableLabels.length)

  if (inputs !== labels.length) {
    points = []
  }

  labels = avaliableLabels.slice(0, inputs)

  nn = new NeuralNetwork(2, hiddenLayers, inputs)
  updateUI()
  draw()
}

function mousePressed() {
  addPoint()
}

function mouseDragged() {
  addPoint()
}

function addPoint() {
  if (mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0) {
    return
  }

  points.push({
    label: label,
    coordinates: [mouseX, mouseY],
  })
}

function draw() {
  background(255)
  noStroke()

  for (let i = 0; i < width / RESOLUTION; i++) {
    for (let j = 0; j < height / RESOLUTION; j++) {
      let x = (i * RESOLUTION) / width
      let y = (j * RESOLUTION) / height

      let predictions = nn.predict([x, y])
      predictions = predictions.map(x => x * 255)

      //let theColor = color(predictions[0], predictions[1], predictions[2])
      let bestLabel = labels[0]
      let bestScore = 0
      for (let c = 0; c < predictions.length; c++) {
        if (predictions[c] > bestScore) {
          bestScore = predictions[c]
          bestLabel = labels[c]
        }
      }

      let bestColor = color(bestLabel)
      bestColor = lerpColor(color(255), bestColor, bestScore / 255)
      fill(bestColor)

      rect(i * RESOLUTION, j * RESOLUTION, RESOLUTION, RESOLUTION)
    }
  }

  fill(255)
  stroke(0)
  text('Label: ' + label, 10, 20)

  stroke(0)

  for (let p of points) {
    fill(color(p.label))
    ellipse(p.coordinates[0], p.coordinates[1], 12)
  }

  for (let i = 0; i < 10; i++) {
    if (training == false || points.length === 0) {
      break
    }

    let point = random(points)

    let coordinates = []

    coordinates.push(point.coordinates[0] / width)
    coordinates.push(point.coordinates[1] / height)

    let targets = []

    for (let l of labels) {
      targets.push(l === point.label ? 1 : 0)
    }

    nn.train(coordinates, targets)
  }
}
