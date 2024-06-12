// import { StatusBar } from 'expo-status-bar';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import LoginScreen from './src/components/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/Drawer/DrawerNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import OnBoardingScreen from './src/components/OnBoardingScreen';
import { CardNoProvider } from './src/Store/CardNoContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CardNoProvider>
      <View className='flex-1'>

        {/* <StatusBar style="auto" /> */}
        <StatusBar hidden={ true } />

        <NavigationContainer>
            <Stack.Navigator initialRouteName="OnBoarding" screenOptions={ { headerShown: false } }>
              <Stack.Screen name='OnBoarding' component={ OnBoardingScreen } />
              <Stack.Screen name="Login" component={ LoginScreen } />
              <Stack.Screen name="Home" component={ DrawerNavigation } />
            </Stack.Navigator>
        </NavigationContainer>

      </View>
    </CardNoProvider>
  );
}