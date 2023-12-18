'use client'

import React, { useState } from "react"

import {copyTextToClipboard} from '@/utils/misc'

export default function Home() {
  const [message, setMessage] = useState('')
  const fetchMessage = async () => {
    console.log('get message')
    const response = await fetch('/api/message')
    const data = await response.json()
    console.log(data)
    setMessage(data.data)
    console.log(data)
  }

  const saveMessage = async () => {
    const response  = await fetch('/api/message', {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({message: message})
    })
    const data = await response.json()
    console.log(data)
  }

  const handleChangeMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.target.value)
    setMessage(event.target.value)
  }

  const handleCopyMessage = () => {
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

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-4">
        <textarea
          id="message"
          rows={20}
          onChange={handleChangeMessage}
          className="block p-2.5 w-11/12 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your thoughts here..."
        />
          <div className="flex flex-row justify-between">
            <button
              onClick={() => saveMessage()}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold hover:text-white my-4 py-2 px-4 rounded-lg"
            >
              Send message
            </button>
            <button
              onClick={() => fetchMessage()}
              className="bg-green-500 hover:bg-green-700 text-white font-semibold hover:text-white my-4 py-2 px-4 rounded-lg ml-4"
            >
              Get message
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold hover:text-white my-4 py-2 px-4 rounded-lg ml-4" onClick={handleCopyMessage}>
              Copy
            </button>
          </div>
      </div>
      <div className="ml-4">
        <pre>{message}</pre>
      </div>
    </div>
  )
}
