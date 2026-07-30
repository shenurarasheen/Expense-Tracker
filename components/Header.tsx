import { View, Text, Image, StyleSheet } from 'react-native';

export default function Header() {

    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <Text style={styles.title}>Expense Tracker</Text>
                <Image style={styles.coinImage} source={require('../assets/coins.png')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#2563EB",
        height: 130,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 22,
    },

    headerContent: {
        flexDirection: "row",

        marginTop: 60,
        alignItems: "center"
    },

    title: {
        color: "white",
        fontSize: 22,
        fontWeight: 500,
    },

    coinImage: {
        width: 35,
        height: 35,
        marginLeft: 10
    },
});