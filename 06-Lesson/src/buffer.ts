export const buf = Buffer.alloc(5, 255)

export const strBuf = Buffer.from('Hi!')
export const tenZero = Buffer.alloc(10, 0)
export const bufCopy = Buffer.from(buf)

strBuf[1] = 'e'.charCodeAt(0)
strBuf[2] = 'y'.charCodeAt(0)

strBuf.write('Gav')

export const firstBuf = Buffer.from('Chicken Banana')
export const secondBuf = Buffer.from('Not sure Turtle!')

// firstBuf.copy(secondBuf)

firstBuf.copy(secondBuf, 0, 8, 14)
