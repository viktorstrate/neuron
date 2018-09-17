// let m = new Matrix(3,2)

class Matrix {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.matrix = []

    for (let i = 0; i < this.rows; i++) {
      this.matrix[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = 0
      }
    }
  }

  /**
   * Change every item in the matrix, by a function
   * @param {(val, row, col)} fn The function to do something to each item in the matrix
   */
  map(fn) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = fn(this.matrix[i][j], i, j)
      }
    }
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (this.cols !== n.rows) {
        console.error('Cols of A must match rows of B')
        return undefined
      }

      let result = new Matrix(this.rows, n.cols)

      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < n.cols; col++) {
          let sum = 0

          for (let i = 0; i < this.cols; i++) {
            sum += this.matrix[row][i] * n.matrix[i][col]
          }

          result.matrix[row][col] = sum
        }
      }

      return result
    } else {
      this.map(val => val * n)
    }
  }

  add(n) {
    if (n instanceof Matrix) {
      this.map((val, i, j) => val + n.matrix[i][j])
    } else {
      this.map(val => val + n)
    }
  }

  randomize() {
    this.map(_ => Math.floor(Math.random() * 10))
  }

  print() {
    console.group('Matrix ' + this.rows + 'x' + this.cols)
    console.table(this.matrix)
    console.groupEnd()
  }
}
