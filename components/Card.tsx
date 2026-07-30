import { View, Text, Pressable, Image, StyleSheet, Alert } from 'react-native';

const URI = 'https://0a06005acbdf.ngrok-free.app';

type Props = {
    title: string;
    desc: string;
    amount: string;
    id: number;
    deleteExpense: (item: number) => void;
    date: string
}

export default function Card(props: Props) {

    return (
        <View style={styles.expenseCard}>
            <View style={styles.cardContent}>
                <View style={styles.dateContainer}>
                    <View style={styles.titleContainer}>
                        <Image source={require('../assets/money_bag.png')} style={styles.moneyBag} />
                        <Text style={styles.cardTitle}>{props.title}</Text>
                    </View>                    
                    <Text style={styles.date}>{props.date.substring(0, 12)}</Text>
                </View>
                <Text style={styles.cardSubtitle}>{props.desc}</Text>
            </View>
            <View style={styles.expenseAmount}>
                <Text style={styles.amount}>{props.amount}</Text>
                <Pressable style={styles.deleteButton} onPress={() => props.deleteExpense(props.id)}>
                    <Image source={require('../assets/bin.png')} style={styles.deleteButtonIcon} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    expenseCard: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0.8,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 4,
    },

    cardContent: {
        flexDirection: 'column',
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: 600,
        color: '#111827'
    },

    cardSubtitle: {
        color: "#6B7280",
        fontSize: 13.5
    },

    expenseAmount: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
    },

    amount: {
        fontWeight: 500,
        fontSize: 15
    },

    deleteButton: {
        width: 22,
        height: 22,
        justifyContent: "center",
        alignItems: "center"
    },

    deleteButtonIcon: {
        width: 18,
        height: 18
    },

    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    date: {
        fontSize: 12,
        color: "#808080"
    },

    titleContainer: {
        flexDirection: "row",
        alignItems: "center"
    },

    moneyBag: {
        width: 20,
        height: 20,
        marginRight: 10
    }
})