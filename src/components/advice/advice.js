import React from "react"
import { calcDays } from "utils/calc"
import { befinden } from "./messages"

const findMessage = (rhythm, day) => {
  for (let i = day; i >= 0; i--) {
    const msg = befinden[i][rhythm]

    if (msg !== "") {
      return msg
    }
  }

  return "Opps! :|"
}

const Advice = ({ birthDate, targetDate }) => {
  const days = calcDays(birthDate, targetDate)
  const physical = Math.trunc(days % 23)
  const emotional = Math.trunc(days % 28)
  const intellectual = Math.trunc(days % 33)

  return (
    <ul>
      <li>{findMessage(0, physical)}</li>
      <li>{findMessage(1, emotional)}</li>
      <li>{findMessage(2, intellectual)}</li>
    </ul>
  )
}

export default Advice
