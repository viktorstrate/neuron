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

  test('.fromArray()', () => {
    let array = [1, 2, 3, 4]
    let n = Matrix.fromArray(array)

    expect(n.rows).toBe(array.length)
    expect(n.cols).toBe(1)

    expect(n.data).toEqual([[1], [2], [3], [4]])
  })

  test('.toArray()', () => {
    let n = new Matrix(4, 1)
    n.data = [[1], [2], [3], [4]]

    let array = n.toArray()

    expect(array.length).toBe(4)
    expect(array).toEqual([1, 2, 3, 4])
  })

  test('.copy()', () => {
    let n = m.copy()

    n.data[0][1] = 123

    expect(n.data[0][1]).toBe(123)
    expect(m.data[0][1]).toBe(2)
  })

  test('.map()', () => {
    m.map(val => val * 2)
    expect(m.data).toEqual([[2, 4, 6], [8, 10, 12]])
  })

  test('.multiply(n)', () => {
    m.multiply(2)
    expect(m.data).toEqual([[2, 4, 6], [8, 10, 12]])
  })

  test('.element_wise(n)', () => {
    n = new Matrix(2, 3)
    n.data = [[2, 3, 4], [5, 6, 7]]

    n.element_wise_multiply(m)

    expect(n.data).toEqual([[2, 6, 12], [20, 30, 42]])
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

describe('static functions', () => {
  let a
  let b

  beforeEach(() => {
    a = new Matrix(2, 3)
    b = new Matrix(2, 3)

    a.data = [[1, 2, 3], [4, 5, 6]]
    b.data = [[7, 8, 9], [10, 11, 12]]
  })

  test('.map(matrix, fn)', () => {
    let c = Matrix.map(a, val => val * val)

    expect(c.data).toEqual([[1, 4, 9], [16, 25, 36]])
    expect(a.data).toEqual([[1, 2, 3], [4, 5, 6]])
  })

  test('.transpose()', () => {
    let c = Matrix.transpose(a)

    expect(c.rows).toBe(a.cols)
    expect(c.cols).toBe(a.rows)
  })

  test('.add(matrix, matrix)', () => {
    let c = Matrix.add(a, b)

    expect(a.data).toEqual([[1, 2, 3], [4, 5, 6]])
    expect(b.data).toEqual([[7, 8, 9], [10, 11, 12]])
    expect(c.data).toEqual([[8, 10, 12], [14, 16, 18]])
  })
})
