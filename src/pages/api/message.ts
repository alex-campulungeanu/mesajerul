import fsPromises from 'fs/promises'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

// const dataFilePath = path.join(process.cwd(), "data", "message.txt")
const dataFilePath = "/tmp/message.txt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const message = await fsPromises.readFile(dataFilePath)
    const messageString = message.toString()
    console.log(messageString)
    return res.status(200).json({data: messageString})

  } else if (req.method === "POST") {
    console.log(dataFilePath)
    try {
      const body = req.body
      console.log(body.message)
      await fsPromises.writeFile(dataFilePath, body.message)
      
    } catch (error) {
      console.error(error)
      res.status(500).json({data: error})
    }
  }
}