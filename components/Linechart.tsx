import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

export default function Linechart() {

  const lineData = [
    { value: 0, dataPointText: '0' },
    { value: 0, dataPointText: '0' },
    { value: 0, dataPointText: '0' },
    { value: 0, dataPointText: '0' },
    { value: 0, dataPointText: '0' },
    { value: 0, dataPointText: '0' },
    { value: 0, dataPointText: '0' },
    { value: 4580, dataPointText: '4580' },
    { value: 27100, dataPointText: '27100' },
  ];

  return (

    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <LineChart
        initialSpacing={0}
        data={lineData}
        spacing={30}
        textColor1="black"
        textShiftY={-8}
        textShiftX={-10}
        textFontSize={11}
        thickness={5}
        hideRules
        hideYAxisText
        yAxisColor="#177AD5"
        showVerticalLines
        verticalLinesColor="#d3d3d3"
        xAxisColor="#177AD5"
        color="#177AD5"
      />
    </View>

  );
}