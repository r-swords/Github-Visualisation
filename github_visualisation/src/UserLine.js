import React from 'react'
//
import { Chart } from 'react-charts'
import commit from './commitfile.json'

function UserLine ({ data }){


  const series = React.useMemo(
    () => ({
      showPoints: false
    }),
    []
  )

  var commitData = React.useMemo(
    () => [
      {
        label: 'Commit Count',
        data: data
      }
    ],
    [data],
  )
  const lineAxes = React.useMemo(
    () => [
      { primary: true, type: 'utc', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    <Chart data={commitData} series={series} axes={lineAxes} tooltip/>
  )

}

export default UserLine
