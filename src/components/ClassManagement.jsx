import { View, Text, StyleSheet, ActivityIndicator, Alert, Modal, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useCardNo } from "../Store/CardNoContext";

const NAMAZ_CLASS_DISPLAY_API = "http://125.209.66.227:8020/api/Namaz_Class/";  //Orginal API
const CARD_NUM_API = 'http://125.209.66.227:8020/api/Class_Member/';
const itemPerPage = 7;

export default function ClassManagement() {


  // const [depName] = useState("Sample");
  const { depName } = useCardNo();
  const { cardNo } = useCardNo("");
  const { deptId } = useCardNo();
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [ClassName, setClassName] = useState("");
  //API DataSet
  const [apiData, setApiData] = useState([]);
  const [ClassCardNo, setClassCardNo] = useState([]);
  // API Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [delModalVisible, setDelModalVisible] = useState(false);
  const [updateShowModal, setUpdateShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);

  const getAPIData = async () => {
    try {
      let result = await fetch(NAMAZ_CLASS_DISPLAY_API);

      if (!result.ok) {
        throw new Error("Failed to fetch data");
      }

      let res = await result.json();
      // setApiData(res);
      // Filter the API data to get only the data for the "Selected" class
      // let cardNo = 158; // Replace with the actual card number you want to filter by
      let softwareClassData = res.filter(item => item.CardNo2 === cardNo || item.CardNo === cardNo || item.HeadCardNo === cardNo);
      setApiData(softwareClassData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const putAPIRequest = async () => {
    const User_input = {
      Class: ClassName,
      CardNo: value,
      CardNo2: value2,
      HeadCardNo: cardNo,
      Department: deptId,
      HeadStatus: true,
      EntryDate: getCurrentDateTime(),
    }
    try {
      let response = await fetch(NAMAZ_CLASS_DISPLAY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(User_input),
      });

      if (!response.ok) {
        throw new Error("Failed to insert data");
      }

      let result = await response.json();
      console.log(result);
      console.log("Data inserted successfully");
      ResetAll();
      getAPIData();
      Alert.alert(
        "Data inserted successfully",
        `Class: ${ClassName}\nCardNo: ${value}\nCardNo2: ${value2}`
      );
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  }

  const getCardNoApi = async () => {
    try {
      let result = await fetch(CARD_NUM_API);

      if (!result.ok) {
        throw new Error("Failed to fetch data");
      }

      let res = await result.json();
      // let cardNo = 158; // Replace with the actual card number you want to filter by

      let classData = res.filter(item => item.HeadCardNo == cardNo || item.HeadCardNo2 == cardNo);

      const updateCardNo = classData.map(item => ({
        label: item.CardNo.toString(),
        value: item.CardNo.toString(),
      }));
      setClassCardNo(updateCardNo);

      // console.log("Fetched Card Numbers", classData);
      // console.log("Fetched Class is ", classData.map(item => item.Class));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const UpdateUser = (id) => {
    setUpdateShowModal(true);
    setSelectedUser(id);
    console.log('Selected Feild Record for editing', id);
  }

  const Delete_User = (id) => {
    setDelModalVisible(true);
    setSelectedUser(id);
    console.log('Selected Feild Record for deleting', id);
  }

  const rows = apiData.slice(
    currentPage * itemPerPage,
    currentPage * itemPerPage + itemPerPage
  );
  const numberOfPage = Math.ceil(apiData.length / itemPerPage);
  const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const timezoneOffset = -currentDate.getTimezoneOffset();
    const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const timezoneMinutes = Math.abs(timezoneOffset) % 60;
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneOffset >= 0 ? "+" : "-"
      }${String(timezoneHours).padStart(2, "0")}:${String(
        timezoneMinutes
      ).padStart(2, "0")}`;
    return formattedDate;
  }

  function ResetAll() {
    setValue(null);
    setValue2(null);
    setClassName("");
    console.log("Clear Feilds data on front Page");
  }

  useEffect(() => {
    getAPIData();
    getCardNoApi();
  }, [])

  return (
    <View className='flex-1 bg-white pt-3.5'>

      {/* Form start here */}
      <View>
        <View className='mx-4'>

          <Text className="ml-1 mb-1">
            Department:{" "}
            <Text className="text-red-600 font-bold text-[15px]">*</Text>
          </Text>
          <TextInput
            className="text-[16px] border border-gray-400 p-3 rounded-xl mb-3"
            value={depName}
            placeholderTextColor="black"
            editable={false}
          />

          <Text className="ml-1 mb-1">
            Enter Class Name:{" "}
            <Text className="text-red-600 font-bold text-[15px]">*</Text>
          </Text>
          <TextInput
            className="text-[16px] border border-gray-400 p-3 rounded-xl mb-3"
            placeholder="Enter Class Name Here..."
            value={ClassName}
            onChangeText={(text) => setClassName(text)}
          />

          <Text className="ml-1 mb-1">
            Head Card No1:{" "}
            <Text className="text-red-600 font-bold text-[15px]">*</Text>
          </Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={ClassCardNo}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select CardNo" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
          />

          <Text className="ml-1 mb-1">
            Head Card No2:{" "}
            <Text className="text-red-600 font-bold text-[15px]">*</Text>
          </Text>
          <Dropdown
            style={[styles.dropdown, isFocus2 && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={ClassCardNo}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus2 ? "Select CardNo" : "..."}
            searchPlaceholder="Search..."
            value={value2}
            onFocus2={() => setIsFocus(true)}
            onBlur={() => setIsFocus2(false)}
            onChange={(item) => {
              setValue2(item.value);
              setIsFocus2(false);
            }}
          />
        </View>

        <View className="flex-row ml-3">
          <TouchableOpacity
            onPress={putAPIRequest}
            className="bg-indigo-700 mx-2 py-2 px-4 rounded-full"
          >
            <Text className="text-white text-[18px]">Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={ResetAll}
            className="bg-gray-500 mx-2 py-2 px-4 rounded-full"
          >
            <Text className="text-white text-[18px]">Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Form end here */}

      {/* API Display code start Here */}
      <View className='flex-1 h-screen'>
        <ScrollView>
          {
            apiData.length ?
              rows.map((item) => (
                <View key={item.TID}>
                  <View className="mt-4 mx-4">
                    <View className="border-b-2 border-gray-400">
                      <View className="flex-row items-center mb-1 bg-indigo-700 rounded-lg">
                        <Text className="font-bold text-[16px] text-white px-3 py-2 w-[40%]">
                          Class:
                        </Text>
                        <Text className="text-[14px] text-white">{item.Class}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                      <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                        Head Card NO 1:
                      </Text>
                      <Text className="text-[14px]">{item.CardNo}</Text>
                    </View>

                    {/* <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                      <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                        Head 1 Name:
                      </Text>
                      <Text className="text-[14px]">{item.CardNo}</Text>
                    </View> */}

                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                      <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                        Head Card NO 2:
                      </Text>
                      <Text className="text-[14px]">{item.CardNo2}</Text>
                    </View>

                    {/* <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                      <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                        Head 2 Name:
                      </Text>
                      <Text className="text-[14px]">{item.CardNo2}</Text>
                    </View> */}

                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                      <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                        Action:
                      </Text>
                      <View className="flex-row">
                        <TouchableOpacity
                          onPress={() => UpdateUser(item)}
                          className="mr-4">
                          <FontAwesome6 name="edit" size={21} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Delete_User(item)
                          }}>
                          <Ionicons name="trash-bin" size={24} color="red" />
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>

                </View>
              )) : (
                <View className='flex-1 mt-11 flex items-center justify-center'>
                  <ActivityIndicator size="large" color="#4338ca" />
                </View>
              )
          }
          <View className='flex-row justify-end mx-4'>
            <TouchableOpacity
              disabled={currentPage === 0}
              onPress={() => handlePageChange(currentPage - 1)}
              className="bg-gray-400 py-1 px-3.5 rounded-[10px] h-[28px]"
            >
              <Text className="text-white text-[14px]">Prev</Text>
            </TouchableOpacity>

            {
              pageIndex.slice(
                Math.max(0, currentPage - 2),
                Math.min(numberOfPage, currentPage + 3)
              ).map((page) => (
                <TouchableOpacity
                  disabled={currentPage >= numberOfPage - 1}
                  onPress={() => handlePageChange(page - 1)}
                  key={page} // Add key prop
                  className='h-[27px]'
                  style={[
                    styles.paginationButton,
                    currentPage + 1 === page && styles.activePaginationButton,
                    currentPage + 1 !== page && styles.inactivePaginationButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.paginationButtonText,
                      currentPage + 1 === page && styles.activePaginationButtonText,
                      currentPage + 1 !== page && styles.inactivePaginationButtonText,
                    ]}
                  >
                    {page}
                  </Text>
                </TouchableOpacity>
              ))}

            <TouchableOpacity
              disabled={currentPage >= numberOfPage - 1}
              onPress={() => handlePageChange(currentPage + 1)}
              className="bg-indigo-700 py-1 px-3.5 rounded-[10px] mb-10 h-[28px]"
            >
              <Text className="text-white text-[14px]">Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {/* API Display code End Here */}

      {/* Update Modal Start here */}
      <View>
        <Modal animationType="fade" visible={updateShowModal} transparent={true}>
          <UserUpdateModal updateShowModal={updateShowModal} setUpdateShowModal={setUpdateShowModal} depName={depName} selectedUser={selectedUser} setSelectedUser={setSelectedUser} isFocus={isFocus} setIsFocus={setIsFocus} isFocus2={isFocus2} setIsFocus2={setIsFocus2} ClassCardNo={ClassCardNo} setClassCardNo={setClassCardNo} value={value} setValue={setValue} value2={value2} setValue2={setValue2} getAPIData={getAPIData} />
        </Modal>
      </View>

      <View>
        <Modal animationType="fade" visible={delModalVisible} transparent={true}>
          <Delete_Class_Modal setDelModalVisible={setDelModalVisible} selectedUser={selectedUser} getAPIData={getAPIData} setSelectedUser={setSelectedUser} />
        </Modal>
      </View>
      {/* Update Modal End here */}

    </View>
  )
}

const UserUpdateModal = (props) => {

  const [updateName, setUpdateName] = useState(props.selectedUser.Class);
  const [updateCardNo, setUpdateCardNo] = useState(props.selectedUser.CardNo);
  const [updateCardNo2, setUpdateCardNo2] = useState(props.selectedUser.CardNo2);
  const [isFocus1, setIsFocus1] = useState(false);  // For Focus
  const [isFocus2, setIsFocus2] = useState(false);  // For Focus 

  const putAPIRequest_User = async () => {
    // console.warn('Update Data Information', updateName, updateCardNo, updateCardNo2, props.selectedUser.TID);
    const Selected_User_Data = props.selectedUser.TID;
    // console.warn(`Testing selected url ${NAMAZ_CLASS_DISPLAY_API}${Selected_User_Data}/`);
    try {
      let response = await fetch(`${NAMAZ_CLASS_DISPLAY_API}${Selected_User_Data}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Class: updateName,
          CardNo: updateCardNo,
          CardNo2: updateCardNo2
        })
      });
      if (!response.ok) {
        throw new Error("Failed to update data");
      }
      let result = await response.json();
      console.log('updated result testing', result);
      console.log("Data updated successfully");
      props.getAPIData();
      props.setUpdateShowModal(false);
    } catch (error) {
      console.error("Error updating data:", error.message);
      props.setUpdateShowModal(false);
    }
  }


  return (
    <View className='flex-1'>
      <View className='flex-1 justify-center'>

        {/* Modal UpdateView Start Here */}
        <View className='bg-white rounded-3xl px-5 py-9 mx-6 border border-gray-400'>
          <Text className="text-[22px] sm:text-[24px] font-bold mb-4">
            Update Details!
          </Text>

          <View className='mx-4'>
            <Text className="ml-1 mb-1">
              Department:{" "}
              <Text className="text-red-600 font-bold text-[15px]">*</Text>
            </Text>
            <TextInput
              className="text-[16px] border border-gray-400 p-3 rounded-xl mb-3"
              value={props.depName}
              placeholderTextColor="black"
              editable={false}
            />

            <Text className="ml-1 mb-1">
              Enter Class Name:{" "}
              <Text className="text-red-600 font-bold text-[15px]">*</Text>
            </Text>
            <TextInput
              className="text-[16px] border border-gray-400 p-3 rounded-xl mb-3"
              placeholder="Enter Class Name Here..."
              value={updateName}
              onChangeText={(text) => setUpdateName(text)}
            />

            <Text className="ml-1 mb-1">
              Head Card No1:{" "}
              <Text className="text-red-600 font-bold text-[15px]">*</Text>
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus1 && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={props.ClassCardNo}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={updateCardNo}
              searchPlaceholder="Search..."
              value={updateCardNo}
              onFocus={() => setIsFocus1(true)}
              onBlur={() => setIsFocus1(false)}
              onChange={(item) => {
                setUpdateCardNo(item.value);
                setIsFocus1(false);
              }}
            />

            <Text className="ml-1 mb-1">
              Head Card No2:{" "}
              <Text className="text-red-600 font-bold text-[15px]">*</Text>
            </Text>
            <Dropdown
              style={[styles.dropdown, isFocus2 && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={props.ClassCardNo}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={updateCardNo2}
              searchPlaceholder="Search..."
              value={updateCardNo2}
              onFocus={() => setIsFocus2(true)}
              onBlur={() => setIsFocus2(false)}
              onChange={(item) => {
                setUpdateCardNo2(item.value);
                setIsFocus2(false);
              }}
            />


          </View>
          {/* Modal Buttons Start here */}
          <View className='flex-row'>
            <TouchableOpacity className="bg-gray-500 px-5 py-3 rounded-xl mr-5" onPress={() => props.setUpdateShowModal(false)} >
              <Text className="text-white font-bold text-center sm:text-[20px]">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => putAPIRequest_User()}
              className="bg-indigo-700 px-5 py-3 rounded-xl"
            >
              <Text className="text-white font-bold text-center sm:text-[20px]">
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Modal UpdateView End Here */}

      </View>
    </View>
  )
}

const Delete_Class_Modal = (props) => {

  const Delete_User_Request = async (id) => {
    try {
      const result = await fetch(`${NAMAZ_CLASS_DISPLAY_API}${id}/`, {
        method: "DELETE",
      });

      if (!result.ok) {
        const errorMessage = await result.text();
        throw new Error(`Failed to delete user. Server response: ${errorMessage}`);
      }

      // Hide the delete modal
      props.setDelModalVisible(false);

      // Refresh the data after deletion
      props.getAPIData();

      // console.warn("User Deleted:", result);
      console.log("This User is Deleted:", result);
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
    // Additional logging for debugging
    console.log('Delete testing, ID:', id);
    console.log('ID type:', typeof id);
    console.log(`URL: ${NAMAZ_CLASS_DISPLAY_API}${id}/`);
  }

  return (
    <View className='flex-1'>
      <View className='flex-1 justify-center items-center'>

        <View className="bg-white rounded-3xl items-center px-5 py-4 mx-6 border border-gray-400">
          <Text className="text-[22px] sm:text-[24px] font-bold mb-4">
            Do you Really Want to Delete?
          </Text>

          <View className="flex-row">
            <TouchableOpacity className="bg-gray-500 px-5 py-3 rounded-xl mr-5" onPress={() => props.setDelModalVisible(false)}>
              <Text className="text-white font-bold text-center sm:text-[20px]">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Delete_User_Request(props.selectedUser.TID)}
              className="bg-indigo-700 px-5 py-3 rounded-xl"
            >
              <Text className="text-white font-bold text-center sm:text-[20px]">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  paginationButton: {
    padding: 4,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "lightgray",
  },
  activePaginationButton: {
    backgroundColor: "#4338ca",
  },
  inactivePaginationButton: {
    backgroundColor: "gray",
  },
  paginationButtonText: {
    fontSize: 13,
    color: "black",
  },
  activePaginationButtonText: {
    color: "white",
  },
  inactivePaginationButtonText: {
    color: "black",
  },
});