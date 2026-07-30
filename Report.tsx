import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "./components/Header";
import Barchart from "./components/Barchart";
import Linechart from "./components/Linechart";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

const URI = 'https://7757d5d21892.ngrok-free.app';

type ExpenseData = Record<string, number>;

export default function Report() {

    const [expenseList, setExpenseList] = useState<ExpenseData>({});

    useFocusEffect(
        useCallback(() => {
            const loadBarchart = async () => {
                const response = await fetch(URI + '/ExpenseTracker/LoadExpensesWithin7Days');

                if (response.ok) {
                    const json = await response.json();
                    const expenses = json.expenseList;
                    setExpenseList(expenses);
                } else {
                    console.log('error')
                }
            }
            loadBarchart();
        }, [])
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Header />

            <View style={styles.chartContainer}>

                <Text style={styles.chartTitle}>Expenses within the week</Text>

                <View style={styles.chartCard}>
                    <Barchart expenseList={expenseList} />
                </View>

                <Text style={styles.chartTitle}>Expenses within Year</Text>

                <View style={styles.chartCard}>
                    <Linechart />
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollView: {
        flexGrow: 1,
        backgroundColor: "#fff"
    },

    chartContainer: {
        padding: 20,
        marginTop: 20
    },

    chartCard: {
        justifyContent: "center",
        marginBottom: 30,
        alignItems: "center",
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 10,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        padding: 15,
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },

    chartTitle: {
        fontSize: 17,
        color: "#808080",
        marginBottom: 20,
        fontWeight: 600
    },

});