const Matrix = require('./matrix')

describe('constructing matrices', () => {
  test('construct matrix', () => {
    let m = new Matrix(2, 3)

    expect(m.rows).toBe(2)
    expect(m.cols).toBe(3)
  })
})

describe('matrix functions', () => {
  let m

  beforeEach(() => {
    m = new Matrix(2, 3)

    m.data = [[1, 2, 3], [4, 5, 6]]
  })

  test('.map()', () => {
    m.map(val => val * 2)
    expect(m.data).toEqual([[2, 4, 6], [8, 10, 12]])
  })

  test('.transpose()', () => {
    let n = m.transpose()

    expect(n.rows).toBe(m.cols)
    expect(n.cols).toBe(m.rows)
  })

  test('.multiply(n)', () => {
    m.multiply(2)
    expect(m.data).toEqual([[2, 4, 6], [8, 10, 12]])
  })

  test('.add(number)', () => {
    m.add(2)
    expect([[3, 4, 5], [6, 7, 8]])
  })

  test('.add(matrix)', () => {
    let n = new Matrix(2, 3)
    n.data = [[1, 2, 3], [4, 5, 6]]
    m.add(n)

    expect(m.data).toEqual([[2, 4, 6], [8, 10, 12]])
  })
})
