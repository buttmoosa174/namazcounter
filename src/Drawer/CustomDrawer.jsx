import React from "react";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Text, ImageBackground, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useCardNo } from "../Store/CardNoContext";

export default CustomDrawer = (props) => {

  const { UserPic } = useCardNo("");
  const { username, setUsername } = useCardNo("");
  const { setLoading } = useCardNo("");

  function handleSignOut() {
    setLoading(false);
    props.navigation.navigate('Login');
    setUsername('');
    // console.warn('Logout! Alert');
  }
  return (
    <View className="flex-1">

      <ImageBackground
        source={require("../img/menu-bg.jpeg")}
        className="p-3 mt-[-5] pt-6"
      >
        <Image
          // source={require("../img/user-profile.jpg")}
          source={{ uri: 'http://10.10.100.4:8013' + UserPic }}
          // source={UserPic ? { uri: 'http://10.10.100.4:8013' + UserPic } : require("../img/user-profile.jpg")}
          // className="h-[80px] w-[80px] mb-[10px] border-4 border-white rounded-[40px]"
          style={{
            width: 80,
            height: 80,
            marginBottom: 10,
            borderWidth: 5,
            borderColor: 'white',
            borderRadius: 40,
          }}
        />
        <View className='flex-row items-center'>
          <Text className="text-white font-bold text-[15px] mb-2 mr-1">
            {username}
          </Text>
          <View className='pb-1.5'>
            <Entypo name="user" size={15} color="white" />
          </View>
        </View>
      </ImageBackground>

      <DrawerContentScrollView
      // {...props}
      // contentContainerStyle={{ backgroundColor: '#4338ca' }}
      >
        <View className="flex-1 bg-white pt-3">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={handleSignOut} style={{ paddingVertical: 15 }}>
          <View className='flex-row items-center bg-indigo-700 pl-4 rounded-md'>
            <Ionicons name="exit-outline" size={20} color={'white'} />
            <Text
              className='text=[15px] ml-1.5 text-white p-2 py-3'
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
