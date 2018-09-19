let nn

function setup() {
  nn = new NeuralNetwork(2, 3, 2)

  let inputs = [1, 0]
  let targets = [0, 1]

  nn.train(inputs, targets)

  // let output = nn.feedforward(inputs)
  // console.log(output)
}

function draw() {}
