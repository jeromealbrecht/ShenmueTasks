"use client"

import { useState, useEffect } from "react"

export default function RyoWatch() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    // const seconds = date.getSeconds().toString().padStart(2, '0'); // Optionnel
    return `${hours}:${minutes}`
  }

  return (
    <div className="bg-neutral-800 text-green-400 font-digital p-2 rounded shadow-md border border-neutral-700">
      <p className="text-2xl tracking-wider">{formatTime(time)}</p>
    </div>
  )
}
