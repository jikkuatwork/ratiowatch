import React, { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const generateFakeData = () => {
  const startDate = new Date(new Date().getFullYear(), 0, 1)
  const data = []
  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    data.push({
      time: Math.floor(currentDate.getTime() / 1000),
      close: 1000 + Math.random() * 1000,
    })
  }
  return data
}

const YTD = ({ from = "BTC", to = "ETH", fakeData = true }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (fakeData) {
        setData(generateFakeData())
        setLoading(false)
      } else {
        try {
          const response = await fetch(
            `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${from}&tsym=${to}&limit=365`
          )
          const result = await response.json()

          if (result.Response === "Error") {
            throw new Error(result.Message)
          }

          setData(result.Data.Data)
          setLoading(false)
        } catch (err) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [from, to, fakeData])

  if (loading)
    return (
      <div className="text-lg md:text-xl font-semibold text-gray-600 py-2 md:py-3 px-3">
        Loading...
      </div>
    )
  if (error)
    return (
      <div className="text-lg md:text-xl font-semibold text-red-600 py-2 md:py-3 px-3">
        Error: {error}
      </div>
    )

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label * 1000)
      return (
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-gray-800 mb-1">
              {payload[0].value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-gray-500">
              {date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const formatXAxis = timestamp => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", { month: "short" })
  }

  const formatYAxis = value => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const minValue = Math.min(...data.map(item => item.close))
  const maxValue = Math.max(...data.map(item => item.close))

  return (
    <div className="w-full py-2 font-sans">
      <div className="w-full h-96">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12, fill: "#4B5563" }}
              interval={30}
              axisLine={{ stroke: "#4B5563" }}
            />
            <YAxis hide={true} domain={[minValue, maxValue]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#232323"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, fill: "#232323" }}
            />
            <ReferenceLine
              y={minValue}
              stroke="#4B5563"
              strokeDasharray="3 3"
              label={{
                position: "insideTopLeft",
                value: formatYAxis(minValue),
                fill: "#4B5563",
                fontSize: 12,
              }}
            />
            <ReferenceLine
              y={maxValue}
              stroke="#4B5563"
              strokeDasharray="3 3"
              label={{
                position: "insideBottomLeft",
                value: formatYAxis(maxValue),
                fill: "#4B5563",
                fontSize: 12,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default YTD
