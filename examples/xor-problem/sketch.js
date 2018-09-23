let nn
let lr_slider

let training_data = [
  {
    inputs: [0, 0],
    targets: [0],
  },
  {
    inputs: [1, 1],
    targets: [0],
  },
  {
    inputs: [0, 1],
    targets: [1],
  },
  {
    inputs: [1, 0],
    targets: [1],
  },
]

function setup() {
  createCanvas(400, 400)
  background(200)

  nn = new NeuralNetwork(2, 4, 1)

  createSpan('Learning Rate:')
  lr_slider = createSlider(0, 0.5, 0.1, 0.01)
}

function draw() {
  nn.learning_rate = lr_slider.value()

  for (let i = 0; i < 50; i++) {
    let data = random(training_data)
    nn.train(data.inputs, data.targets)
  }

  let resolution = 10
  let cols = width / resolution
  let rows = height / resolution

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols
      let x2 = j / rows

      let y = nn.predict([x1, x2])
      fill(y * 255)
      strokeWeight(0)

      rect(i * resolution, j * resolution, resolution, resolution)
    }
  }
}
