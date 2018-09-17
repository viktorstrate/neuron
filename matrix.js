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
   *
   * @param {number|Matrix} n a number or a Matrix
   */
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
            sum += this.data[row][i] * n.data[i][col]
          }

          result.data[row][col] = sum
        }
      }

      return result
    } else {
      this.map(val => val * n)
    }
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
    this.map(_ => Math.floor(Math.random() * 10))
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
