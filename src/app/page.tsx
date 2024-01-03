'use client'

import React, { ChangeEvent, useState } from "react"

import {copyTextToClipboard} from '@/utils/misc'
import { MessageType } from '@/interfaces/message'
import FileTypeMessage from "@/components/FileTypeMessage"
import TextTypeMessage from "@/components/TextTypeMessage"

export default function Home() {
  const [message, setMessage] = useState<File | string | null>(null)
  const [messageInfo, setMessageInfo] = useState<string | null>('')
  const [messageType, setMessageType] = useState<MessageType>('text')
  
  const fetchMessage = async () => {
    const response = await fetch(`/api/message?type=${messageType}`)
    if (messageType == 'text') {
      const data = await response.json()
      console.log(data)
      setMessage(data.data)
      setMessageInfo(data.data)
    } else {
      const headers = response.headers
      const fileName = headers.get('filename')
      const data = await response.blob()
      const blob = new Blob([data], { type: 'application/octet-stream' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `${fileName}`
      link.click()
      setMessageInfo(fileName)
    }
  }

  const saveMessage = async () => {
    let messageBody
    if (messageType === 'text') {
      messageBody = JSON.stringify({message: message})
      const response  = await fetch(`/api/message?type=${messageType}`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: messageBody
      })
      const data = await response.json()
      console.log(data)
    } else {
      if (message) {
        const formData = new FormData()
        formData.append("file", message)
        messageBody = formData
        const response  = await fetch(`/api/message?type=${messageType}`, {
          method: "POST",
          // headers: {
          //   'Content-Type': "application/json"
          // },
          body: messageBody
        })
        const data = await response.json()
        console.log(data)
      } else {
        console.error("no file was selected")
      }
    }
  }

  const handleChangeMessage = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    if (messageType === 'text') {
      setMessage(event.target.value)
    } else {
      setMessage(event.target.files[0])
    }
  }

  const handleCopyMessage = () => {
    if (typeof message === 'string') {
      // Asynchronously call copyTextToClipboard
      copyTextToClipboard(message)
      .then(() => {
        // If successful, update the isCopied state value
        console.log('message copied')
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  const handlePurgeMessage = async () => {
    const response = await fetch(`/api/message?type=${messageType}`, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json"
      }
    })
    const data = await response.json()
    console.log(data)
  }
  
  const handleMessageType = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const updatedMessageType: MessageType= checked ? 'file' : "text" 
    setMessageType(updatedMessageType)
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-4">
        <label className="relative inline-flex items-center cursor-pointer mb-6">
          <input 
            type="checkbox" 
            value="" 
            className="sr-only peer"
            onChange={handleMessageType}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-lg text-gray-900">{messageType}</span>
        </label>
        {messageType === 'text' && <TextTypeMessage handleChangeMessage={handleChangeMessage}/>}
        {messageType === 'file' && <FileTypeMessage handleChangeMessage={handleChangeMessage}/>}
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="flex flex-row justify-between">
            <button
              onClick={() => saveMessage()}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold hover:text-white my-4 py-2 px-4 rounded-lg"
            >
              Send {messageType}
            </button>
            <button
              onClick={() => fetchMessage()}
              className="bg-green-500 hover:bg-green-700 text-white font-semibold hover:text-white my-4 py-2 px-4 rounded-lg ml-4"
            >
              Get {messageType}
            </button>
            {messageType === 'text' && (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold hover:text-white my-4 py-2 px-4 rounded-lg ml-4" onClick={handleCopyMessage}>
                Copy {messageType}
              </button>
            )}
            <button className="bg-red-500 hover:bg-red-700 text-white font-semibold hover:text-white my-4 py-2 px-4 rounded-lg ml-4" onClick={handlePurgeMessage}>
              Remove {messageType}
            </button>
          </div>
        </div>
      </div>
      <div className="m-6 border-2 border-sky-300 p-5">
        <pre>{messageInfo}</pre>
      </div>
    </div>
  )
}
