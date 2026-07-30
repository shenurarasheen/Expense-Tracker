import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "./components/Header";
import Card from "./components/Card";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";
import { FlatList } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

const URI = 'https://7757d5d21892.ngrok-free.app';

type Expense = {
    id: number,
    title: string,
    description: string,
    amount: string,
    month: number,
    date: string
}

const getThisYear = () => {
    return new Date().getFullYear();
}

const years = [2020, 2021, 2022, 2023, 2024, 2025];

export default function History() {

    const [expenseList, setExpenseList] = useState<Expense[]>([]);
    const [selectedYear, setSelectedYear] = useState(() => getThisYear());
    const [yearList, setYearList] = useState(years);

    const deleteExpense = async (id: number) => {
        const response = await fetch(URI + '/ExpenseTracker/DeleteExpense?id=' + id, {
            method: "DELETE"
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: json.message,
                });
                setExpenseList(prevList => (
                    prevList.filter(expense => expense.id !== id)
                ));
            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: json.message
                });
            }
        } else {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: "Unknown error occured! Please try again later!"
            });
        }

    };

    useFocusEffect(
        useCallback(() => {
            const loadHistory = async () => {
                const response = await fetch(URI + '/ExpenseTracker/LoadHistory?year=' + selectedYear);

                if (response.ok) {
                    const json = await response.json();
                    const expensesList: Expense[] = json.expensesList;
                    if (expensesList) {
                        setExpenseList(expensesList);
                    } else {

                    }
                } else {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Error',
                        textBody: "Unknown error occured! Please try again later!"
                    });
                }
            }
            loadHistory();
        }, [selectedYear])
    );

    useEffect(() => {
        const thisYear = getThisYear();
        if (!yearList.includes(thisYear)) {
            setYearList([...yearList, thisYear]);
        }
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Header />

            <View style={styles.form}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>All Expenses</Text>
                    <Picker style={styles.picker} selectedValue={selectedYear} onValueChange={(itemValue) => setSelectedYear(itemValue)}>
                        {
                            yearList.map((year, index) => (
                                <Picker.Item label={String(year)} key={index} value={year} />
                            ))
                        }

                    </Picker>
                </View>

                {
                    expenseList.length == 0 ? (
                        <View style={styles.emptyViewContainer}>
                            <Text style={styles.emptyViewText}>No expenses added for this Year!</Text>
                        </View>
                    )
                        :
                        (
                            <FlatList
                                data={expenseList}
                                renderItem={
                                    ({ item }) => (
                                        <Card title={item.title} desc={item.description} amount={'LKR. ' + item.amount + '.00'} key={item.id} id={item.id} deleteExpense={deleteExpense} date={item.date} />
                                    )
                                }
                                scrollEnabled={false}
                            />
                        )
                }

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    form: {
        flex: 1,
        paddingHorizontal: 22,
        paddingVertical: 20
    },

    title: {
        color: '#808080',
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 20
    },

    emptyViewText: {
        marginTop: 20,
        marginBottom: 20,
        textAlign: "center",
        fontSize: 14
    },

    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    picker: {
        height: 50,
        width: 100,
        marginBottom: 20,
    },

    emptyViewContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20
    }

});