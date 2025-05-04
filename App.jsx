import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import existing components
import HomeScreen from "./components/HomeScreen";
import Details from "./components/Details";
import Favourite from "./components/Favourite";
import Header from "./components/Header";

// Create Stack navigator
const Stack = createStackNavigator();

// Main App Component with Stack Navigation
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          // headerShown: false 
          header: (props) => <Header {...props} />
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="CryptoDetail"
          component={Details}
        />
        <Stack.Screen
          name="Favourite"
          component={Favourite}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
