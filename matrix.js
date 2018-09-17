// let m = new Matrix(3,2)

class Matrix {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.data = []

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = 0
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
        this.data[i][j] = fn(this.data[i][j], i, j)
      }
    }
  }

  /**
   * Swap columns and rows
   * @returns a new matrix
   */
  transpose() {
    let result = new Matrix(this.cols, this.rows)

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[j][i] = this.data[i][j]
      }
    }

    return result
  }

  /**
   * Convert an array to a matrix
   * @param {Array} array the array to convert
   */
  static fromArray(array) {
    let m = new Matrix(array.length, 1)
    for (let i = 0; i < array.length; i++) {
      m.data[i][0] = array[i]
    }
    return m
  }

  toArray() {
    let array = []

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        array.push(this.data[row][col])
      }
    }

    return array
  }

  /**
   * Multiply two matrices together
   * @param {Matrix} a first matrix
   * @param {Matrix} b second matrix
   */
  static multiply(a, b) {
    if (a.cols !== b.rows) {
      console.error('Cols of A must match rows of B')
      return undefined
    }

    let result = new Matrix(a.rows, b.cols)

    for (let row = 0; row < a.rows; row++) {
      for (let col = 0; col < b.cols; col++) {
        let sum = 0

        for (let i = 0; i < a.cols; i++) {
          sum += a.data[row][i] * b.data[i][col]
        }

        result.data[row][col] = sum
      }
    }

    return result
  }

  /**
   * Multiplies the matrix with a number
   * @param {number} n the number to multiply with
   */
  multiply(n) {
    this.map(val => val * n)
  }

  /**
   * add a number or another matrix to the matrix
   * @param {number|Matrix} n a number or a matrix
   */
  add(n) {
    if (n instanceof Matrix) {
      this.map((val, i, j) => val + n.data[i][j])
    } else {
      this.map(val => val + n)
    }
  }

  /**
   * Fills the matrix with random values from 0 to 9
   */
  randomize() {
    this.map(_ => Math.random() * 2 - 1)
  }

  /**
   * Prints the content of the matrix to the console
   */
  print() {
    console.group('Matrix ' + this.rows + 'x' + this.cols)
    console.table(this.data)
    console.groupEnd()
  }
}

// Export if used in node environment
if (typeof module !== 'undefined') {
  module.exports = Matrix
}
