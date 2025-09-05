import http from 'http'
import fs from 'fs'
import { readFile, appendFile, writeFile, rename, unlink } from 'fs/promises'
import { buf, bufCopy, secondBuf, strBuf, tenZero } from './buffer'

const nameFile = './src/hello.txt'
const newNameFile = './src/hello2.txt'
const content = 'Some content'

async function appendDataToFile(nameFile: string, data: string) {
  try {
    await appendFile(nameFile, data, { flag: 'w' })
    console.log(`Appended to file ${nameFile} successfully`)
  } catch (e) {
    console.error(
      `Got an error while appending to the file: ${nameFile}`,
      (e as Error).message,
    )
  }
}

async function writeDataToFile(nameFile: string, data: string) {
  try {
    await writeFile(nameFile, data)
    console.log(`File ${nameFile} is updated successfully`)
  } catch (e) {
    console.error(
      `Got an error while updating the file: ${nameFile}`,
      (e as Error).message,
    )
  }
}

async function getDataFile(nameFile: string) {
  try {
    const data = await readFile(nameFile)
    console.log(data.toString())
  } catch (e) {
    console.error(
      `Got an error while reading file: ${nameFile}`,
      (e as Error).message,
    )
  }
}

async function renameFile(from: string, to: string) {
  try {
    await rename(from, to)
    console.log(`File ${from} is renamed to ${to} successfully`)
  } catch (e) {
    console.error(
      `Got an error while renaming file ${from} to ${to}`,
      (e as Error).message,
    )
  }
}

async function removeFile(nameFile: string) {
  try {
    await unlink(nameFile)
    console.log(`File ${nameFile} is removed successfully`)
  } catch (e) {
    console.error(
      `Got an error while removing file ${nameFile}`,
      (e as Error).message,
    )
  }
}

// appendDataToFile(nameFile, 'I like this')
// writeDataToFile(nameFile, '----------------')
// getDataFile(nameFile)

// renameFile(nameFile, newNameFile)

// removeFile(nameFile)

// fs.open(nameFile, 'a', (err, file) => {
//   if (err) throw err

//   fs.write(file, content, (err) => {
//     if (err) throw err

//     console.log('Content added to the file')
//     fs.close(file, (err) => {
//       if (err) throw err
//       console.log('File closed')
//     })
//   })
// })

console.log(strBuf, bufCopy)
console.log(strBuf[0])
console.log(strBuf[50])
console.log(strBuf.toString())
console.log(strBuf.toString('hex'))
console.log(strBuf.toJSON())
console.log(tenZero.toJSON())

console.log(secondBuf.toString())

http
  .createServer(function (req, res) {
    try {
      fs.readFile(nameFile, (err, data) => {
        if (err) {
          res.write(err.message)
          return res.end()
        }
        res.writeHead(200, { 'Content-type': 'text/html' })
        res.write(data)
        return res.end()
      })
    } catch (e) {
      res.write((e as Error).message)
      res.end()
      console.log(e)
    }
  })
  .listen(8080)
