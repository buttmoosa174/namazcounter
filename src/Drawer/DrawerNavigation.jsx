import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Image } from 'react-native';
import Gif from 'react-native-gif';
import { LinearGradient } from 'expo-linear-gradient';
import ClassManagement from "../components/ClassManagement";
import Dashboard from "../components/Dashboard";
import ClassMember from "../components/ClassMember";
import PrayerManagement from "../components/PrayerManagement";
import ViewReportDep from "../components/ViewReportDep";
import ViewAllReport from "../components/ViewAllReport";
import ViewCountMember from "../components/ViewCountMember";
import ViewOverAllDep from "../components/ViewOverAllDep";
import KabaDirection from "../components/KabaDirection";
import CustomDrawer from "./CustomDrawer";
import { Ionicons, FontAwesome, AntDesign, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import ManagePrayer from "../components/Prayers_Add_View/ManagePrayer";

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4338ca',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        },
        headerTintColor: 'white', // Change to your desired text color
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 13,
        },
        drawerActiveBackgroundColor: "#4338ca",
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "#333",
      }}
      // initialRouteName="Manage Prayer"
      initialRouteName="Dashboard"
    >

      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Qibla Direction"
        component={KabaDirection}
        options={{
          drawerIcon: ({ color }) => (
            <Entypo name="direction" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Class Management"
        component={ClassManagement}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome name="group" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Class Member Management"
        component={ClassMember}
        options={{
          drawerIcon: ({ color }) => (
            // <AntDesign name="addusergroup" size={18} color={color} />
            <Ionicons name="people" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Prayer Management"
        component={PrayerManagement}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="pray" size={18} color={color} />
            /* <Gif
              source={require("../img/Animation-1.gif")}
              style={{ width: 30, height: 30 }}
            /> */
          ),
        }}
      />
{/* 
      <Drawer.Screen
        name="Manage Prayer"
        component={ManagePrayer}
        options={{
          drawerIcon: ({ color }) => (
            // <AntDesign name="addusergroup" size={18} color={color} />
            <Ionicons name="people" size={18} color={color} />
          ),
        }}
      /> */}

      {/*
      <Drawer.Screen
        name="View Report of Department"
        component={ViewReportDep}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="preview" size={18} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name      = "View All Departments + Classes Reports"
        component = {ViewAllReport}
        options   = {{
          drawerIcon: ( { color } ) => (
            <FontAwesome name = "files-o" size = {18} color = { color } />
          ),
        }}
      />

      <Drawer.Screen
        name      = "View Overall Department Reports"
        component = {ViewOverAllDep}
        options   = {{
          drawerIcon: ( { color } ) => (
            <FontAwesome name = "files-o" size = {18} color = {color} />
          ),
        }}
      />

      <Drawer.Screen
        name      = "View Report of Count of Memebers in Class"
        component = {ViewCountMember}
        options   = {{
          drawerIcon: ( { color } ) => (
            <MaterialCommunityIcons
              name  = "account-group-outline"
              size  = {18}
              color = {color}
            />
            
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
}
