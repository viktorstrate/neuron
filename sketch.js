let nn

function setup() {
  nn = new NeuralNetwork(2, 3, 1)

  let input = [1, 0]

  let output = nn.feedforward(input)
  console.log(output)
}

function draw() {}
