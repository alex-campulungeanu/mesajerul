import { MessageType } from '@/interfaces/message'
import React, {ChangeEvent} from 'react'

interface TextTypeMessageProps {
  handleChangeMessage: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

function TextTypeMessage({handleChangeMessage}: TextTypeMessageProps) {
  return (
    <>
      <textarea
        id="message"
        rows={20}
        onChange={handleChangeMessage}
        className="block p-2.5 w-11/12 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Write your thoughts here..."
      />
    </>
  )
}

export default TextTypeMessage
