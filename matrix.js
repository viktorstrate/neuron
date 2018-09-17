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
}
