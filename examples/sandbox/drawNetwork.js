function findCoordinates(originX = 0, originY = 0) {
  let networkLayers = getNetworkLayers()
  let layerCoordinates = []
  let biggestLayer = networkLayers.reduce((prev, curr) => max(prev, curr), 0)

  for (let col = 0; col < networkLayers.length; col++) {
    const layer = networkLayers[col]
    layerCoordinates[col] = []

    let startY = (biggestLayer * 50) / 2
    startY -= (layer * 50) / 2
    startY += NETWORK_PADDING * 2

    for (let row = 0; row < layer; row++) {
      let x = NETWORK_PADDING + 25 + col * 100 + originX
      let y = startY + row * 50 + originY
      layerCoordinates[col][row] = [x, y]
    }
  }

  return layerCoordinates
}

function drawNetwork() {
  let networkLayers = getNetworkLayers()
  let layerCoordinates = findCoordinates()

  fill(255)

  // Draw lines between nodes
  for (let col = 0; col < layerCoordinates.length - 1; col++) {
    for (let row = 0; row < layerCoordinates[col].length; row++) {
      const node = layerCoordinates[col][row]

      for (
        let nextRow = 0;
        nextRow < layerCoordinates[col + 1].length;
        nextRow++
      ) {
        let weight = nn.weights[col].data[nextRow][row]

        strokeWeight(abs(weight) / 5 + 0.2)

        let weightColor = null
        if (weight > 0) {
          weightColor = lerpColor(color(200, 255, 200), color('green'), weight)
        } else {
          weightColor = lerpColor(
            color(255, 200, 200),
            color('red'),
            abs(weight)
          )
        }

        stroke(weightColor)

        let nextNode = layerCoordinates[col + 1][nextRow]
        line(node[0], node[1], nextNode[0], nextNode[1])

        // Biases
        if (col > 0 && col < layerCoordinates.length - 1) {
          let x1 = layerCoordinates[col][0][0] - 60
          let y1 = 40

          line(x1, y1, node[0], node[1])
        }
      }
    }
  }

  strokeWeight(1)
  stroke(0)
  // Draw nodes
  for (let col = 0; col < layerCoordinates.length; col++) {
    // biases
    if (col > 0 && col < layerCoordinates.length - 1) {
      ellipse(layerCoordinates[col][0][0] - 60, 40, 16)
    }

    for (let row = 0; row < layerCoordinates[col].length; row++) {
      const coord = layerCoordinates[col][row]

      ellipse(coord[0], coord[1], 25)
    }
  }
}
