import moment from "moment"

export const getRate = (birthDate, targetDate, ritimo) => {
  const days = calcDays(birthDate, targetDate)
  const rate = calcRitimo(days, ritimo)

  return rate
}

export const getBirthDate = () => {
  const date = localStorage.getItem("birthDate") || ""
  return date
}

export const calcDays = (birthDate, targetDate) => {
  const start = moment(birthDate)
  const end = moment(targetDate)

  return moment.duration(end.diff(start)).asDays()
}

export const calcRitimo = (days, ritimo) =>
  Math.sin((2 * Math.PI * days) / ritimo)
