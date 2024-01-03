import { MessageType } from '@/interfaces/message'
import fsPromises from 'fs/promises'
import { NextRequest, NextResponse} from 'next/server'
import path from 'node:path'

import { messageTextFile, messagePath, messageFileContainer } from '@/utils/constants'

const messageTextPath = path.join(messagePath, messageTextFile)
const messageFilePath = path.join(messagePath, messageFileContainer)

// TODO: didn't had the inspirations for variable names, fix this pls: messageTextPath, messageFilePath, messageFilePAthWithName
export async function GET(req: NextRequest) {
  const messageType = req.nextUrl.searchParams.get('type') as MessageType
  let payload
  if (messageType === 'text') {
    const message = await fsPromises.readFile(messageTextPath)
    const messageString = message.toString()
    console.log(messageString)
    payload = {data: messageString}
    return NextResponse.json(payload)
  } else {
    const fileList = await fsPromises.readdir(messageFilePath)
    console.log(fileList[0])
    const fileName = fileList[0]
    const buffer = await fsPromises.readFile(path.join(messageFilePath, fileName))
    const blob = new Blob([buffer])
    const headers = new Headers()
    headers.set('filename', fileName)
    return new NextResponse(blob, {status: 200, statusText: 'ok', headers})
  }
}

export async function POST(req: NextRequest) {
  const messageType = req.nextUrl.searchParams.get('type') as MessageType
  if (messageType === 'text') {
    const body = await req.json()
    const messageBody = body.message
    console.log(messageBody)
    try {
      await fsPromises.writeFile(messageTextPath, messageBody)
      return NextResponse.json({data: messageBody})
    } catch (error) {
      console.error(error)
      return NextResponse.json({data: error})
    }
  } else {
    console.log('posting a file')
    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File
    // console.log(dat)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    try {
      await fsPromises.mkdir(messageFilePath)
    } catch (error) {
      console.error("unable to create directory in temp for file upload")
    }
    const messageFilePathWithName = path.join(messagePath, messageFileContainer, file.name)
    await fsPromises.writeFile(messageFilePathWithName, buffer)
    return NextResponse.json({data: 'file was uploaded'})
  }
}

export async function DELETE(req: NextRequest) {
  const messageType = req.nextUrl.searchParams.get('type') as MessageType
  if (messageType === 'text') {
    try {
      await fsPromises.writeFile(messageFilePath, '')
      return NextResponse.json({data: 'message text was removed'})
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('deleteing  a file')
    const fileList = await fsPromises.readdir(messageFilePath)
    fileList.forEach(file => {
      fsPromises.rm(path.join(messageFilePath, file))
    })
    return NextResponse.json({data: 'file was deleted'})
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
}