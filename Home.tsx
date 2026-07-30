import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import Card from './components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';

const URI = 'https://7757d5d21892.ngrok-free.app';

type Expense = {
  id: number,
  title: string,
  description: string,
  amount: string,
  month: number,
  date: string
}

export default function App() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');

  const [expenseList, setExpenseList] = useState<Expense[]>([]);

  useEffect(() => {
    const setCurrencyType = async () => {
      try {
        let currencyType = await AsyncStorage.getItem("currency");
        if (!currencyType) {
          await AsyncStorage.setItem("currency", "LKR");
          currencyType = 'LKR';
        } else {
          setCurrency(currencyType);
        }
      } catch (error) {
        console.log(error);
        setCurrency('LKR');
      }
    }
    setCurrencyType();
  }, []);

  function getCurrentMonth() {
    const today = new Date();
    return today.getMonth();
  }

  //load months to the picker
  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonth());
  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const totlaExpenseAmount = () => {
    return expenseList.map(expense => Number(expense.amount))
      .reduce((a1, a2) => { return (a1 + a2) }, 0);
  }

  //save expense details
  const saveExpenses = async () => {
    const expenseData = {
      title: title,
      description: description,
      amount: amount,
      month: selectedMonth + 1
    }

    const expenseDataJson = JSON.stringify(expenseData);

    const response = await fetch(URI + '/ExpenseTracker/AddExpense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: expenseDataJson
    });

    if (response.ok) {
      const json = await response.json();
      if (json.status) {
        const addedItem = json.item;
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: json.message,
        });

        setExpenseList(prevExpenses => [...prevExpenses, addedItem]);

        setTitle('');
        setDescription('');
        setAmount('');
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: json.message
        })
      }
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Unknown error occured! Please try again later!',
      })
    }
  }

  useEffect(() => {
    const loadExpenses = async () => {
      const response = await fetch(URI + '/ExpenseTracker/LoadExpenses?month=' + (selectedMonth + 1));

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          setExpenseList(json.expenseList);
        } else {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: json.message,
          });
        }
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Unknown error occured! Please try again later!',
        });
      }
    }
    loadExpenses();
  }, [selectedMonth]);

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

  return (
    <AlertNotificationRoot>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>

        <Header />

        <View style={styles.form}>
          <View style={styles.addExpenseContainer}>
            <Text style={styles.expensesText}>Enter expenses here</Text>
            <Picker selectedValue={selectedMonth} style={styles.monthPicker} onValueChange={(itemValue) => setSelectedMonth(itemValue)}>
              {
                months.map((month, index) => (
                  <Picker.Item label={month} value={index} key={index} />
                ))
              }
            </Picker>
          </View>

          <TextInput placeholder='Enter the title here' style={styles.input} onChangeText={setTitle} value={title} />

          <TextInput placeholder='Enter the description here' style={styles.input} onChangeText={setDescription} value={description} />

          <TextInput placeholder='Enter expense here' style={styles.input} keyboardType='phone-pad' onChangeText={setAmount} value={amount} />

          <Pressable style={styles.addButton} onPress={() => { saveExpenses() }}>
            <Text style={styles.addButtonText}>Add Expense</Text>
          </Pressable>

          <Text style={styles.expensesText}>Expenses within month</Text>

          <View style={styles.viewExpenses}>
            {
              expenseList.length == 0 ? (
                <View>
                  <Text style={styles.emptyViewText}>No expenses added for this month!</Text>
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

          <View style={styles.line}></View>

          <View style={styles.subTotalContainer}>
            <Text style={styles.totalAmountText}>Total Amount :</Text>
            <Text style={styles.totalAmount}>
              {`${currency}. ${totlaExpenseAmount()} .00`}
            </Text>
          </View>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },

  form: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 20
  },

  expensesText: {
    color: "#808080",
    fontSize: 16,
    marginBottom: 18
  },

  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15
  },

  addButton: {
    height: 42,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 3,
    marginBottom: 20
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: 600,
    color: "white",
  },

  viewExpenses: {
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    padding: 16
  },

  subTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 15,
    marginBottom: 20
  },

  totalAmountText: {
    fontSize: 16,
    fontWeight: 600
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: 600
  },

  line: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 15,
  },

  addExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
  },

  monthPicker: {
    width: 100,
    height: 52,
    backgroundColor: "#F2F2F2",
    alignSelf: "center",
    marginBottom: 20
  },

  emptyViewText: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 14
  }

});
