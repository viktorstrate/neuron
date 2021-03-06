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
   * Change every item in a copy of the given matrix, by given function
   * @param {Matrix} matrix the matrix to be mapped
   * @param {(val, row, col)} fn the function used to map each item in the matrix
   */
  static map(matrix, fn) {
    let newMatrix = matrix.copy()

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        newMatrix.data[i][j] = fn(matrix.data[i][j], i, j)
      }
    }

    return newMatrix
  }

  /**
   * Swap columns and rows, returns a new matrix
   * @param {Matrix} matrix the matrix to be transposed
   * @returns a new matrix
   */
  static transpose(matrix) {
    let result = new Matrix(matrix.cols, matrix.rows)

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.data[j][i] = matrix.data[i][j]
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
   * Multiply each element in the matrices with each other.
   * Also known as Hadamard product
   * Returns a new matrix
   * @param {Matrix} a first matrix
   * @param {Matrix} b second matrix
   */
  static element_wise_multiply(a, b) {
    if (a.cols !== b.cols || a.rows !== b.rows) {
      console.error('Matrices must have same dimensions')
      return
    }

    let result = new Matrix(a.rows, a.cols)

    for (let row = 0; row < a.rows; row++) {
      for (let col = 0; col < a.cols; col++) {
        result.data[row][col] = a.data[row][col] * b.data[row][col]
      }
    }

    return result
  }

  /**
   * Multiply each element in the matrices with each other.
   * Also known as Hadamard product
   * @param {Matrix} matrix the matrix to multiply with
   */
  element_wise_multiply(matrix) {
    if (this.cols !== matrix.cols || this.rows !== matrix.rows) {
      console.error('Matrices must have same dimensions')
      return
    }

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.data[row][col] = this.data[row][col] * matrix.data[row][col]
      }
    }
  }

  /**
   * Add a number or another matrix to a matrix, a new matrix is returned
   * @param {Matrix} a the matrix the addition is based upon
   * @param {Matrix|number} b either another matrix or a number to be added to the first matrix
   */
  static add(a, b) {
    if (b instanceof Matrix) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        console.error('Rows and columns must be equal')
        return
      }

      let newMatrix = Matrix.map(a, (val, i, j) => val + b.data[i][j])

      return newMatrix
    } else {
      return Matrix.map(a, val => val + b)
    }
  }

  /**
   * Add a number or another matrix to the matrix
   * @param {number|Matrix} n a number or a matrix
   */
  add(n) {
    if (n instanceof Matrix) {
      if (this.cols !== n.cols || this.rows !== n.rows) {
        console.error('Rows and columns must be equal')
        return
      }

      this.map((val, i, j) => val + n.data[i][j])
    } else {
      this.map(val => val + n)
    }
  }

  /**
   * Subtract a number or another matrix from a matrix, a new matrix is returned
   * @param {Matrix} a the matrix the subtraction is based upon
   * @param {Matrix|number} b either another matrix or a number to be subtracted from the first matrix
   */
  static subtract(a, b) {
    if (b instanceof Matrix) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        console.error('Rows and columns must be equal')
        return
      }

      let newMatrix = Matrix.map(a, (val, i, j) => val - b.data[i][j])

      return newMatrix
    } else {
      return Matrix.map(a, val => val - b)
    }
  }

  /**
   * Subtract a number or another matrix from the matrix
   * @param {number|Matrix} n a number or a matrix
   */
  subtract(n) {
    if (n instanceof Matrix) {
      if (this.cols !== n.cols || this.rows !== n.rows) {
        console.error('Rows and columns must be equal')
        return
      }

      this.map((val, i, j) => val - n.data[i][j])
    } else {
      this.map(val => val - n)
    }
  }

  /**
   * Fills the matrix with random values from 0 to 9
   */
  randomize() {
    this.map(_ => Math.random() * 2 - 1)
  }

  /**
   * Returns a copy of the matrix
   */
  copy() {
    let copyMatrix = new Matrix(this.rows, this.cols)

    copyMatrix.data = []

    for (let row = 0; row < this.rows; row++) {
      copyMatrix.data[row] = []
      for (let col = 0; col < this.cols; col++) {
        copyMatrix.data[row][col] = this.data[row][col]
      }
    }

    return copyMatrix
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
