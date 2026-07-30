import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import History from './History';
import Report from './Report'
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {

  type rootParamList = {
    Home: undefined,
    History: undefined,
    Report: undefined
  }

  const Tab = createBottomTabNavigator<rootParamList>();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let iconName: string;

              if (route.name == 'Home') {
                iconName = 'home';
              } else if (route.name == 'History') {
                iconName = 'time';
              } else {
                iconName = 'bar-chart'
              }
              return <Icon name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: '#000c66',
            tabBarInactiveTintColor: 'gray',
          })}
        >

          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="History" component={History} />
          <Tab.Screen name="Report" component={Report} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}