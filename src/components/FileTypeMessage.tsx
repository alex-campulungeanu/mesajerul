import React, { ChangeEvent, useState } from 'react'

interface TextTypeMessageProps {
  handleChangeMessage: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

function FileTypeMessage({handleChangeMessage}: TextTypeMessageProps) {
  const [file, setFile] = useState(null)
  return (
    <>
      <div>
        <label htmlFor="file">
          Choose a file
        </label>
        <input type="file" onChange={handleChangeMessage}/>
      </div>
      {file && (
        <section>
          File details:
          <ul>
            <li>name: {file.name}</li>
          </ul>
        </section>
      )}
      <button onClick={() => console.log('handle button lcick')}>

      </button>
    </>
  )
}

export default FileTypeMessage
