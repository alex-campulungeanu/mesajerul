import { MessageType } from '@/interfaces/message'
import fsPromises from 'fs/promises'
import { NextApiRequest, NextApiResponse } from 'next'

const dataFilePath = "/tmp/message.txt"

// TODO: look at nextjs route handlers
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: why doing this typing check, is so stupid !
  const messageType = req.query.type as MessageType
  console.log(messageType)
  if (req.method === "GET") {
    let payload
    if (messageType === 'text') {
      const message = await fsPromises.readFile(dataFilePath)
      const messageString = message.toString()
      console.log(messageString)
      payload = {data: messageString}
    } else {
      console.log('object')
    }
    return res.status(200).json(payload)
  } else if (req.method === "POST") {
    if (messageType === 'text') {
      const messageBody = req.body.message
      console.log(dataFilePath)
      try {
        console.log(messageBody)
        await fsPromises.writeFile(dataFilePath, messageBody)
        
      } catch (error) {
        console.error(error)
        res.status(500).json({data: error})
      }
    } else {
      const bdy = req.body
      // console.log(bdy)
      console.log('posting a file')
      res.status(200).json({data: 'some data'})
    }
  } else if (req.method === "DELETE") {
    console.log(dataFilePath)
    try {
      const body = ''
      await fsPromises.writeFile(dataFilePath, body)
      
    } catch (error) {
      console.error(error)
      res.status(500).json({data: error})
    }
  }

}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};