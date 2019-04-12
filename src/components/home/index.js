import React, { useEffect, useState } from "react"
import Chart from "chart.js"
import "chartjs-plugin-annotation"
import moment from "moment"
import ProgressBar from "progressbar.js"
import { getRate, getBirthDate, calcDays, calcRitimo } from "utils/calc"

export default function() {
  const [persons, setPersons] = useState(
    JSON.parse(localStorage.getItem("persons")) || []
  )
  const [selectedPerson, setSelectedPerson] = useState(null)

  const [name, setName] = useState("")

  const handleBirthDateChange = value => {
    if (moment(value).isValid()) {
      localStorage.setItem("birthDate", value)
    }

    setBirthDate(value)
  }

  const handleSelectPerson = value => {
    if (!value) {
      return
    }

    const p = persons[value]

    setSelectedPerson(p)
    setName(p.name)
    setBirthDate(p.birthDate)
  }

  const handleAdd = ({ name, birthDate, targetDate }) => {
    if (!name || !birthDate || !targetDate) {
      return
    }

    const persons = JSON.parse(localStorage.getItem("persons")) || []

    persons.push({
      name,
      birthDate
    })

    localStorage.setItem("persons", JSON.stringify(persons))

    setPersons(persons)
  }

  const getLabels = targetDate => {
    const days = window.matchMedia("(min-width: 420px)") ? 30 : 30
    const labels = []
    const endDate = moment(targetDate).subtract(days / 2 - 1, "days")
    for (let i = 0; i < days; i += 1) {
      const targetDate = moment(endDate).add(i, "days")
      labels.push(targetDate.format("DD/MM"))
    }

    return labels
  }

  const getDataSet = (birthDate, targetDate, ritimo) => {
    const nDays = window.matchMedia("(min-width: 420px)") ? 30 : 30

    const data = []
    const endDate = moment(targetDate).subtract(nDays / 2 - 1, "days")
    for (let i = 0; i <= nDays; i += 1) {
      const date = moment(endDate).add(i, "days")
      const days = calcDays(birthDate, date)
      const rate = calcRitimo(days, ritimo)

      data.push(rate)
    }

    return data
  }

  const [birthDate, setBirthDate] = useState(getBirthDate())
  const [targetDate, setTargetDate] = useState(moment().format("YYYY-MM-DD"))

  useEffect(() => {
    const labels = getLabels(targetDate)
    const fisico = getDataSet(birthDate, targetDate, 23)
    const emocional = getDataSet(birthDate, targetDate, 28)
    const intelectual = getDataSet(birthDate, targetDate, 33)

    const ctx = document.getElementById("myChart")

    var myChart = new Chart(ctx, {
      responsive: true,
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Físico",
            data: fisico,
            borderColor: "blue",
            borderWidth: 1,
            fill: false
          },
          {
            label: "Emocional",
            data: emocional,
            borderColor: "orange",
            borderWidth: 1,
            fill: false
          },
          {
            label: "Intelectual",
            data: intelectual,
            borderColor: "green",
            borderWidth: 1,
            fill: false
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 1
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: window.matchMedia("(max-width: 420px)").matches
                  ? 5
                  : 30
              }
            }
          ]
        },
        annotation: {
          annotations: [
            {
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: moment(targetDate).format("DD/MM"),
              borderColor: "red"
            }
          ]
        }
      }
    })

    return () => {
      myChart.destroy()
    }
  }, [birthDate, targetDate])

  useEffect(() => {
    const fisicoElement = document.getElementById("fisico")
    const fisicoRate = getRate(birthDate, targetDate, 23)
    const fisicoPie = new ProgressBar.Circle(fisicoElement, {
      color: "blue",
      trailColor: "#f4f4f4",
      strokeWidth: 2,
      /*svgStyle: {
        display: "inline",
        width: "100px"
      },*/
      text: {
        value: `${fisicoRate.toFixed(1)} %`
      }
      //trackColor: "blue"
    })
    fisicoPie.animate(fisicoRate)

    const emocionalElement = document.getElementById("emocional")
    const emocionalRate = getRate(birthDate, targetDate, 28)
    const emocionalPie = new ProgressBar.Circle(emocionalElement, {
      color: "orange",
      trailColor: "#f4f4f4",
      text: {
        value: `${emocionalRate.toFixed(1)} %`
      }
      //trackColor: "blue"
    })
    emocionalPie.animate(emocionalRate)

    const intelectualElement = document.getElementById("intelectual")
    const intelectualRate = getRate(birthDate, targetDate, 33)
    const intelectualPie = new ProgressBar.Circle(intelectualElement, {
      color: "green",
      trailColor: "#f4f4f4",
      text: {
        value: `${intelectualRate.toFixed(1)} %`
      }
      //trackColor: "blue"
    })
    intelectualPie.animate(intelectualRate)

    return () => {
      fisicoPie.destroy()
      emocionalPie.destroy()
      intelectualPie.destroy()
    }
  }, [birthDate, targetDate])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center"
        }}
      >
        <h1>Biorítmo</h1>
        <select onChange={e => handleSelectPerson(e.target.value)}>
          <option value="">Selecionar pessoa</option>
          {persons.map((p, index) => (
            <option value={index}>{p.name}</option>
          ))}
        </select>
        <br />
        <div
          style={{
            padding: "0 10px",
            display: "flex",
            textAlign: "center"
          }}
        >
          <label style={{ textAlign: "left" }}>
            Data de nascimento
            <input
              type="date"
              onChange={e => handleBirthDateChange(e.target.value)}
              value={birthDate}
            />
          </label>
          <label style={{ textAlign: "left" }}>
            Data alvo
            <input
              type="date"
              onChange={e => setTargetDate(e.target.value)}
              value={targetDate}
            />
          </label>
        </div>

        <br />

        <input
          type="text"
          onChange={e => setName(e.target.value)}
          value={name}
        />
        <br />
        <button onClick={() => handleAdd({ name, birthDate, targetDate })}>
          Add
        </button>
      </section>

      <br />

      <div
        style={{
          padding: "0 5 px",
          position: "relative",
          width: null,
          height: 250,
          flex: 1
        }}
      >
        <canvas id="myChart" />
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            padding: "0 10px"
          }}
        >
          <div class="chart" id="fisico" />
        </div>
        <div
          style={{
            padding: "0 10px"
          }}
        >
          <div class="chart" id="emocional" />
        </div>
        <div
          style={{
            padding: "0 10px"
          }}
        >
          <div class="chart" id="intelectual" />
        </div>
      </div>
    </div>
  )
}
