import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useCardNo } from "../Store/CardNoContext";
import { handleLogin } from "./Auth/AuthService";

const LoginScreen = ({ navigation }) => {
  const { cardNo, setCardNo } = useCardNo("");
  const { setUsername } = useCardNo("");
  const { setDepName } = useCardNo("");
  const { setUserPic } = useCardNo("");
  const { setDepId } = useCardNo("");
  // const { isLoading, setIsLoading }       = useCardNo (true);
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { loading, setLoading } = useCardNo(false);

  const postData = {
    username: cardNo,
    password: password,
  };

  const handleLoginButton = async () => {
    if (cardNo == "" || password == "") {
      Alert.alert("Please Enter Card No. and Password");
    } else {
      setLoading(true);
      await handleLogin(
        postData,
        password,
        navigation,
        setCardNo,
        setPassword,
        setUsername,
        setDepName,
        setUserPic,
        setDepId
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center pt-[52px] sm:justify-center bg-white relative">
      <View className="absolute top-[60%]">
        <ActivityIndicator animating={loading} size="large" color="#4338ca" />
      </View>

      <View className="w-[83%]">
        <ScrollView>
          <Modal visible={modalVisible} animationType="fade" transparent={true}>
            <View className="flex-1 justify-center items-center">
              <View className="bg-white rounded-3xl items-center px-5 py-4 mx-6 border border-gray-400">
                <Text className="text-[22px] sm:text-[24px] font-bold mb-4">
                  Forgot Your Password?
                </Text>
                <Text className="text-[16px] sm:text-[22px] mb-4">
                  If you have forgotten your password, please contact the{" "}
                  <Text className="font-bold">IT office</Text> for assistance in
                  recovering it.
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-indigo-500 px-5 py-3 rounded-xl"
                >
                  <Text className="text-white font-bold text-center sm:text-[20px]">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View className="items-center">
            <Image
              source={require("../img/Login3.png")}
              className="h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] -rotate-6"
            />
          </View>

          <Text className="text-3xl font-bold mb-4 text-center">
            100% Namazi App
          </Text>
          <Text className="text-3xl font-bold mb-8 text-center">Login</Text>

          <View className="flex-row border-b-2 border-gray-400 pb-2 mb-6">
            <MaterialIcons
              name="alternate-email"
              size={24}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <TextInput
              placeholder="Card No."
              className="flex-1"
              keyboardType="numeric"
              value={cardNo.toString()} // Convert cardNo to string
              onChangeText={setCardNo}
            />
          </View>

          <View className="flex-row border-b-2 border-gray-400 pb-2 mb-6">
            <Octicons
              name="unlock"
              size={24}
              color="#666"
              style={{ marginRight: 9 }}
            />
            <TextInput
              placeholder="Password..."
              className="flex-1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className="text-indigo-600 font-bold">Forgot?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-indigo-500 p-5 mb-8 rounded-lg"
            onPress={handleLoginButton}
          >
            <Text className="text-white text-[18px] sm:text-[22px] text-center font-bold">
              Login
            </Text>
          </TouchableOpacity>
          <Text className="text-center sm:text-[18px]">
            "Prayer (Salat) is the key to Paradise."
          </Text>
          <Text className="text-center font-bold sm:text-[18px]">
            Prophet Muhammad (peace be upon him)
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
