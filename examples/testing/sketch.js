let nn

let training_data = [
  {
    inputs: [0, 0],
    targets: [1],
  },
  {
    inputs: [1, 1],
    targets: [1],
  },
  {
    inputs: [0, 1],
    targets: [0],
  },
  {
    inputs: [1, 0],
    targets: [0],
  },
]

function setup() {
  nn = new NeuralNetwork(2, [3, 3], 1)

  nn.train([1, 1], [1])
  nn.train([1, 0], [0.5])
  nn.train([0, 0], [0])
  nn.train([0.3, 0.3], [0.3])

  console.log(nn.feedforward([1, 0]))
}
