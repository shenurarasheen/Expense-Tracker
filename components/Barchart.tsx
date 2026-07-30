import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type Props = {
    expenseList: {
        [key: string]: number;
    }
}

export default function Barchart(props: Props) {
    const barData = [];

    // Convert the dictionary to bar chart data
    for (const [day, amount] of Object.entries(props.expenseList)) {
        barData.push({
            value: Number(amount) === 0 ? 1 : Number(amount),
            label: day.substring(8),
            frontColor: '#177AD5'
        });
    }

    barData.sort((a, b) => parseInt(a.label) - parseInt(b.label));

    return (
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <BarChart
                width={260}
                height={200}
                barWidth={15}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={40}
            />
        </View>
    );
}