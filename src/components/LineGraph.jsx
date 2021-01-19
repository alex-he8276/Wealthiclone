import { ResponsiveLine } from '@nivo/line'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const data = [
  {
    "id": "Your Portfolio",
    "color": "hsl(151, 70%, 50%)",
    "data": [
      {
        "x": "01/11/2021",
        "y": 350
      },
      {
        "x": "01/12/2021",
        "y": 321
      },
      {
        "x": "01/13/2021",
        "y": 409
      },
      {
        "x": "01/14/2021",
        "y": 507
      },
      {
        "x": "01/15/2021",
        "y": 482
      },
      {
        "x": "01/16/2021",
        "y": 530
      },
      {
        "x": "01/17/2021",
        "y": 560
      },
      {
        "x": "01/18/2021",
        "y": 598
      },
      {
        "x": "01/19/2021",
        "y": 573
      },
    ]
  }
]

export default function MyResponsiveLine() {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'date',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 10,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'value ($)',
        legendOffset: -50,
        legendPosition: 'middle'
      }}
      curve={'monotoneX'}
      areaBaselineValue={'320'}
      enableArea={true}
      colors={{ scheme: 'accent' }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'top-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  );
}
