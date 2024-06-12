import { View, Text, Button, StyleSheet, ScrollView, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { Calendar } from "react-native-calendars";
import { FontAwesome6 } from '@expo/vector-icons';
import { useCardNo } from "../Store/CardNoContext";
import ManagePrayer from "./Prayers_Add_View/ManagePrayer";

// const url = "http://125.209.66.227:8020/api/Namaz_Counter/getSubordinates/"; //display api
// const url = "http://125.209.66.227:8020/api/Namaz_Counter/getSubordinates/"; //display api
const url = "http://125.209.66.227:8020/api/Namaz_Counter/getSubordinates/"; //display api
const namaz_class_url = "http://125.209.66.227:8020/api/Namaz_Class/";  //Classes API
const update_url = "http://125.209.66.227:8020/api/Namaz_Counter/"; // update User Info api 
const url2 = "http://125.209.66.227:8020/api/Namaz_Counter/NamazData/";
const Class_Member_API = 'http://125.209.66.227:8020/api/Class_Member/NamazData/';

const itemPerPage = 8;

export default function PrayerManagement() {

  const [highlihtBtn, sethighlightBtn] = useState(1);

  function PrayerCountEntryOutput() {
    sethighlightBtn(1);
  }

  function PrayerManageOutput() {
    sethighlightBtn(2);
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-center">

        <View className="m-4">
          <Button
            onPress={PrayerCountEntryOutput}
            title="Prayer Count Entry"
            color={highlihtBtn === 1 ? "#4338ca" : "grey"}
          />
        </View>
        <View className="m-4">
          <Button
            onPress={PrayerManageOutput}
            title="Manage Prayer"
            color={highlihtBtn === 2 ? "#4338ca" : "grey"}
          />
        </View>

      </View>
      {highlihtBtn === 1 ? <PrayerCount /> : <ManagePrayer />}
    </View>
  );
}

const PrayerCount = () => {

  const [value, setValue] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [getPrayerAPI, setGetPrayerAPI] = useState([])
  const [getClass, setClass] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [NoOfPrayers, setNoOfPrayers] = useState({});
  const [selectclassId, setSelectClassId] = useState();
  const [CountPrayer, setCountPrayer] = useState();
  const [DeptCountMember, setDeptCountMember] = useState();
  const [existingPrayers, setExistingPrayers] = useState();


  const { cardNo } = useCardNo("");
  const { deptId } = useCardNo("");


  const rows = getPrayerAPI.slice(
    currentPage * itemPerPage,
    currentPage * itemPerPage + itemPerPage
  );
  const numberOfPage = Math.ceil(getPrayerAPI.length / itemPerPage);
  const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPrayerApi = async (classId) => {
    try {
      let result = await fetch(Class_Member_API);

      if (!result.ok) {
        throw new Error("Failed to fetch data");
      }

      let res = await result.json();
      // Filter the API data to get only the data for the Selected 
      let softwareClassData = res.filter(item => (item.HeadCardNo == cardNo || item.HeadCardNo2 == cardNo) && (item.Status == true) && (item.ClassID === classId));
      // disable_Field(classId);
      setGetPrayerAPI(softwareClassData);

      //*********************************************************************
      // Check if there are existing prayer records for the selected date
      // let existingPrayers = res.filter(item => item.Date === selectedDate && item.ClassID === classId && item.NoOfPrayers > 0 && item.SubordinateCardNo);
      // let existingPrayersMap = {};
      // existingPrayers.forEach(item => {
      //   existingPrayersMap[item.TID] = true;
      // });
      // setExistingPrayers(existingPrayersMap);
      /*********************************************************************///

      // Filter the data to count the members in the class
      let mainStoreMembers = res.filter(item => (item.ClassID === classId) && (item.Status === true));
      // Count the number of members in the "Main Store" class
      let mainStoreMemberCount = mainStoreMembers.length;

      let Class_Prayer_Count = mainStoreMemberCount * 5;
      console.log('Class prayer count total:', Class_Prayer_Count);
      setCountPrayer(Class_Prayer_Count);
      // console.log(`Number of members in the "Main Store" class: ${mainStoreMemberCount} & ${JSON.stringify(mainStoreMembers)}`);

      // Filter the data to count the Dept Member Count in the database
      let mainDeptMember = res.filter(item => (item.Department == deptId) && (item.Status == true));
      // Count the number of members in the Department
      let mainDeptMemberCount = mainDeptMember.length;
      console.log('dept member ka  counter', mainDeptMemberCount);
      setDeptCountMember(mainDeptMemberCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const disable_Field = async () => {
  //   const data = {
  //     CardNo: cardNo,
  //     ClassID: 67,
  //   };

  //   try {
  //     let response = await fetch('http://125.209.66.227:8020/api/Namaz_Counter/NamazData/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch data: ' + response.statusText);
  //     }

  //     let result = await response.json();

  //     let existingPrayers = {}; // Object to store insertion status for each record

  //     result.forEach(item => {
  //       existingPrayers[item.TID] = item.NoOfPrayers >= 0; // Record is already inserted
  //     });

  //     setExistingPrayers(existingPrayers); // Update state with insertion status
  //     console.log(existingPrayers, 'existing prayers'); // Log insertion status

  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  // const disable_Field = async () => {
  //   try {
  //     let result = await fetch(update_url);

  //     if (!result.ok) {
  //       throw new Error("Failed to fetch data");
  //     }
  //     let res = await result.json();
  //     console.log(res, 'ressssssssssss');
  //     let prayer = res.filter(item => item.Date === selectedDate && item.ClassID === 67 && item.NoOfPrayers > 0 && item.SubordinateCardNo === 11989);
  //     if (prayer) {
  //       setExistingPrayers(true);
  //     } else {
  //       setExistingPrayers(false);
  //     }

  //   } catch (error) {
  //     console.log("Error", error)
  //   }
  // }

  const getClassApi = async () => {
    try {
      let result = await fetch(namaz_class_url);

      if (!result.ok) {
        throw new Error("Failed to fetch data");
      }

      let res = await result.json();
      let classData = res.filter(item => item.HeadCardNo == cardNo || item.CardNo == cardNo || item.CardNo2 == cardNo);
      const updatedClassMember = classData.map(item => ({
        label: item.Class,
        value: item.Class,
        classId: item.TID // Add classId property from the DB
      }));
      setClass(updatedClassMember);
      console.log('class is', classData);
      // Set default value to the first class in the list
      if (updatedClassMember.length > 0) {
        setValue(updatedClassMember[0].value);
        getPrayerApi(updatedClassMember[0].classId); // Fetch prayer data for the default selected class
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (date) => {
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1); // Subtract 1 to get yesterday's date
    const year = yesterday.getFullYear();
    const month = (yesterday.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
    const day = yesterday.getDate().toString().padStart(2, '0'); // Add leading zero if needed

    return `${year}-${month}-${day}`;
  };

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let entrydate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} 00:00:00`;
  // console.log(entrydate, 'entrydate');

  //  const prayerAPIData = async (item, prayers) => {
  //   try {
  //     const data = {
  //       SubordinateCardNo: item.CardNo,
  //       HeadCardNo: cardNo, // logged user card no
  //       EntryDate: entrydate, // format YYYY-MM-DD 00:00:00
  //       Date: selectedDate, // selected date format YYYY-MM-DD 00:00:00
  //       NoOfPrayers: prayers, // namaz quantity entered by user
  //       DepartmentID: item.Department, // dept id
  //       ClassMemberName: item.ClassMemberName,
  //       DesignationName: item.Designation,
  //       MemberClass: item.Class,
  //       ClassID: item.ClassID, // backup classid
  //       DepartmentName: item.deptName, // DepartmentName name
  //       ClassPrayerCount: CountPrayer,
  //       DeptMemberCount: DeptCountMember,
  //     };

  //     console.log("Sending data:", data); // Log data being sent

  //     let response = await fetch('http://125.209.66.227:8020/api/Namaz_Counter/', {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     console.log("Response status:", response.status); // Log response status

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Failed to insert data: ${response.status} ${errorText}`);
  //     }

  //     let result = await response.json();
  //     console.log("Data inserted successfully", result);
  //     NoOfPrayers({});
  //   } catch (error) {
  //     console.error("Error inserting data:", error.message);
  //   }
  // };

  const prayerAPIData = async (item, prayers) => {
    try {
      const data = {
        SubordinateCardNo: item.CardNo,
        HeadCardNo: cardNo, // logged user card no
        EntryDate: entrydate, // format YYYY-MM-DD 00:00:00
        Date: selectedDate, // selected date format YYYY-MM-DD 00:00:00
        NoOfPrayers: prayers, // namaz quantity entered by user
        DepartmentID: item.Department, // dept id
        ClassMemberName: item.ClassMemberName,
        DesignationName: item.Designation,
        MemberClass: item.Class,
        ClassID: item.ClassID, // backup classid
        DepartmentName: item.deptName, // DepartmentName name
        ClassPrayerCount: CountPrayer,
        DeptMemberCount: DeptCountMember,
      };

      console.log("Sending data:", data); // Log data being sent

      let response = await fetch('http://125.209.66.227:8020/api/Namaz_Counter/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status); // Log response status

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to insert data: ${response.status} ${errorText}`);
      }

      let result = await response.json();
      console.log("Data inserted successfully", result);
      setNoOfPrayers(prevState => ({ ...prevState, [item.TID]: '' }));
    } catch (error) {
      // console.error("Error inserting data:", error.message);
      Alert.alert("Data is Already Inserted");
    }
  };

  useEffect(() => {
    getClassApi();
    setSelectedDate(formatDate(new Date()));
    // disable_Field();
  }, []);

  return (
    <View style={styles.container1}>
      <Text className="text-center text-2xl font-bold mb-5">
        Prayer Count Entry
      </Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={getClass}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select Class" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          getPrayerApi(item.classId, selectedDate);
          // getPrayerApi(item.classId);
          setIsFocus(false);
        }}
      />

      {/* Calender start here */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 items-center justify-center">
          <View className="border border-gray-300">
            <Calendar
              className="border border-gray-400"
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setModalVisible(false);
                console.log("selected day", day);
              }}
              markedDates={{
                [selectedDate]: { selected: true },
              }}
              theme={{
                selectedDayBackgroundColor: "#4338ca",
                todayTextColor: "#4338ca",
              }}
            />
            <Button
              onPress={() => setModalVisible(false)}
              color={"#4338ca"}
              title="Close"
            />
          </View>
        </View>
      </Modal>
      {/* Calender end here */}


      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white border border-gray-400 p-3 rounded-lg"
      >
        <Text className="border-gray-950 text-[16px]">
          {selectedDate ? selectedDate : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {/* <View className="flex-row justify-center mt-5">
        <TouchableOpacity className="bg-indigo-700 py-2 px-4 rounded-full">
          <Text className="text-[18px] text-white text-center font-bold">
            Save
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* API data Show here */}
      <ScrollView>
        {
          getPrayerAPI.length ?
            rows.map((item) => (
              <View className="mt-4 mx-1" key={item.TID}>
                <View className="border-b-2 border-gray-400">
                  <View className="flex-row items-center mb-1 bg-indigo-700 rounded-lg">
                    <Text className="font-bold text-[16px] text-white px-3 py-2 w-[39%]">
                      Class:
                    </Text>
                    <Text className="text-[14px] text-white">{item.Class}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
                    Card NO:
                  </Text>
                  <Text className="text-[14px]">{item.CardNo}</Text>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
                    Name:
                  </Text>
                  <Text className="text-[14px]">{item.ClassMemberName}</Text>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
                    Department:
                  </Text>
                  <Text className="text-[14px]">{item.deptName}</Text>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
                    Designation:
                  </Text>
                  <Text className="text-[14px]">{item.Designation}</Text>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
                    Prayer Counter:
                  </Text>
                  <View className='flex-1'>
                    <TouchableOpacity
                      className='mr-2'
                      onPress={() => {
                        console.log('sksksksk');
                      }}
                    >
                      <TextInput
                        className='border border-gray-500 mb-1 rounded-lg px-3 py-1'
                        placeholder="Enter today's offered namaz"
                        value={NoOfPrayers[item.TID] || ''}
                        keyboardType="numeric"
                        onChangeText={text => setNoOfPrayers(prevState => ({ ...prevState, [item.TID]: text }))}
                      // editable={false} // Disable if prayer already exists
                      // editable={!existingPrayers[item.TID]} // Disable if prayer already exists
                      // editable={!existingPrayers} // Disable if prayer already exists
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="flex-row justify-center mt-3">
                  <TouchableOpacity
                    // onPress={() => prayerAPIData(item, NoOfPrayers[item.TID])}
                    onPress={() => {
                      // Check if the input field is empty
                      if (!NoOfPrayers[item.TID]) {
                        // Show alert message
                        Alert.alert("Please enter today's offered namaz");
                      } else {
                        // Proceed with API call
                        prayerAPIData(item, NoOfPrayers[item.TID]);
                      }
                    }}
                    // onPress={() => {
                    //   const prayerCount = Number(NoOfPrayers[item.TID]);
                    //   if (!isNaN(prayerCount) && prayerCount >= 0) {
                    //     prayerAPIData(item, prayerCount);
                    //   } else {
                    //     console.error("Invalid prayer count");
                    //   }
                    // }}
                    // disabled={true} // Disable button if prayer already exists
                    // disabled={existingPrayers}
                    // disabled={existingPrayers[item.TID]}
                    className="bg-indigo-700 py-2 px-4 rounded-lg">
                    <Text className="text-[17px] text-white text-center font-bold">
                      ADD
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))

            : <View className='flex-1 items-center justify-center my-5'>
              <ActivityIndicator size="large" color="#4338ca" />
            </View>
        }
        <View className='flex-row justify-end mx-4 mt-3'>
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
      {/* Insertion end here */}
    </View>
  );
};

// const ManagePrayer = () => {

//   const { cardNo } = useCardNo();
//   const [value, setValue] = useState();
//   const [isFocus, setIsFocus] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [apiData, setApiData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);

//   const [updateModal, setUpdateModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(undefined);

//   const [getClass, setClass] = useState([]);

//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectClassId, setSelectClassId] = useState();

//   const rows = apiData.slice(
//     currentPage * itemPerPage,
//     currentPage * itemPerPage + itemPerPage
//   );
//   const numberOfPage = Math.ceil(apiData.length / itemPerPage);
//   const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const getAPI_Manage_Data = async (date, classId) => {
//     const data = {
//       CardNo: cardNo,
//       EntryDate: date,
//     }
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }

//       const responseData = await response.json();
//       console.log("Testing Data of Manage Prayer", responseData);
//       const Manage_prayer_Classes = responseData.filter(item => item.ClassID == classId);
//       setApiData(Manage_prayer_Classes);
//       console.log("Manage Prayer", Manage_prayer_Classes);

//     } catch (error) {
//       console.error('Error while fetching data', error.message);
//     }
//   };

//   const getClassApi = async () => {
//     try {
//       let result = await fetch(namaz_class_url);

//       if (!result.ok) {
//         throw new Error("Failed to fetch data");
//       }

//       let res = await result.json();
//       let classData = res.filter(item => item.HeadCardNo == cardNo || item.CardNo == cardNo || item.CardNo2 == cardNo);
//       const updatedClassMember = classData.map(item => ({
//         label: item.Class,
//         value: item.Class,
//         classId: item.TID // Add classId property from the DB
//       }));
//       setClass(updatedClassMember);
//       console.log('class is', classData);
//       // Set default value to the first class in the list
//       // if (updatedClassMember.length > 0) {
//       //   setValue(updatedClassMember[0].value);
//       //   getAPI_Manage_Data(updatedClassMember[0].classId); // Fetch prayer data for the default selected class
//       // }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const updateAPIData = async (id) => {
//     setUpdateModal(true);
//     setSelectedUser(id);
//   }
//   const formatDate = (date) => {
//     const yesterday = new Date(date);
//     yesterday.setDate(date.getDate() - 1); // Subtract 1 to get yesterday's date
//     const year = yesterday.getFullYear();
//     const month = (yesterday.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
//     const day = yesterday.getDate().toString().padStart(2, '0'); // Add leading zero if needed
//     return `${year}-${month}-${day}`;
//   };

//   useEffect(() => {
//     getClassApi();
//     // setSelectedDate(formatDate(new Date()));
//     // getAPI_Manage_Data();
//   }, [])
//   return (
//     <View className='flex-1 px-4 pb-4'>

//       <View>
//         <Modal animationType="fade" visible={updateModal} transparent={true}>
//           <UpdateModal selectedUser={selectedUser} setUpdateModal={setUpdateModal} getAPI_Manage_Data={getAPI_Manage_Data} selectClassId={selectClassId} selectedDate={selectedDate} />
//         </Modal>
//       </View>

//       <Text className="text-center text-2xl font-bold mb-5">Manage Prayer</Text>
//       <Dropdown
//         style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
//         placeholderStyle={styles.placeholderStyle}
//         selectedTextStyle={styles.selectedTextStyle}
//         inputSearchStyle={styles.inputSearchStyle}
//         iconStyle={styles.iconStyle}
//         data={getClass}
//         search
//         maxHeight={300}
//         labelField="label"
//         valueField="value"
//         placeholder={!isFocus ? "Select Class" : "..."}
//         searchPlaceholder="Search..."
//         value={value}
//         onFocus={() => setIsFocus(true)}
//         onBlur={() => setIsFocus(false)}
//         onChange={(item) => {
//           setValue(item.value);
//           setIsFocus(false);
//           setSelectClassId(item.classId);
//           // getAPI_Manage_Data(item.classId);
//         }}
//       />

//       {/* Calender start here */}
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View className="flex-1 items-center justify-center">
//           <View className="border border-gray-300">
//             <Calendar
//               className="border border-gray-400"
//               onDayPress={(day) => {
//                 setSelectedDate(day.dateString);
//                 setModalVisible(false);
//                 console.log("selected day", day);
//               }}
//               markedDates={{
//                 [selectedDate]: { selected: true },
//               }}
//               theme={{
//                 selectedDayBackgroundColor: "#4338ca",
//                 todayTextColor: "#4338ca",
//               }}
//             />
//             <Button
//               onPress={() => setModalVisible(false)}
//               color={"#4338ca"}
//               title="Close"
//             />
//           </View>
//         </View>
//       </Modal>
//       {/* Calender end here */}

//       <TouchableOpacity
//         onPress={() => setModalVisible(true)}
//         className="bg-white border border-gray-400 p-3 rounded-lg"
//       >
//         <Text className="border-gray-950 text-[16px]">
//           {selectedDate ? selectedDate : 'Select Date'}
//         </Text>
//       </TouchableOpacity>
//       {/* Search Button */}
//       <View className="flex-row justify-center mt-5">
//         <TouchableOpacity
//           onPress={() => getAPI_Manage_Data(selectedDate, selectClassId)}
//           className="bg-indigo-700 py-2 px-4 rounded-full">
//           <Text className="text-[18px] text-white text-center font-bold">
//             Search
//           </Text>
//         </TouchableOpacity>
//       </View>
//       {/* Search Button end */}

//       <View className='flex-1 h-screen'>
//         <ScrollView>
//           {
//             apiData.length ?
//               rows.map((item) => (
//                 <View className="mt-4 mx-1" key={item.TID}>
//                   <View className="border-b-2 border-gray-400">
//                     <View className="flex-row items-center mb-1 bg-indigo-700 rounded-lg">
//                       <Text className="font-bold text-[16px] text-white px-3 py-2 w-[39%]">
//                         Class:
//                       </Text>
//                       <Text className="text-[14px] text-white">{item.MemberClass}</Text>
//                     </View>
//                   </View>

//                   <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
//                     <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Card NO:
//                     </Text>
//                     <Text className="text-[14px]">{item.SubordinateCardNo}</Text>
//                   </View>

//                   <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
//                     <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Name:
//                     </Text>
//                     <Text className="text-[14px] font-bold">{item.ClassMemberName}</Text>
//                   </View>

//                   <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
//                     <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Department:
//                     </Text>
//                     <Text className="text-[14px]">{item.DepartmentName}</Text>
//                   </View>

//                   <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
//                     <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Designation:
//                     </Text>
//                     <Text className="text-[14px]">{item.DesignationName}</Text>
//                   </View>

//                   {/* <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
//                     <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Entry Date:
//                     </Text>
//                     <Text className="text-[14px]">{item.EntryDate}</Text>
//                   </View> */}

//                   <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
//                     {/* <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Actual Date:
//                     </Text> */}
//                     <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Entry Date:
//                     </Text>
//                     <Text className="text-[14px]">{item.Date}</Text>
//                   </View>

//                   <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
//                     <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Prayer Counter:
//                     </Text>
//                     <Text className="text-[15px] font-bold">{item.NoOfPrayers}</Text>
//                   </View>

//                   <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
//                     <Text className="font-bold text-[16px] px-3 py-1 w-[39%]">
//                       Action:
//                     </Text>
//                     <View className='flex-row'>
//                       <TouchableOpacity onPress={() => updateAPIData(item)} className='mr-4'>
//                         <FontAwesome6 name="edit" size={21} color="black" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               )) :
//               (
//                 apiData.length ?
//                   <View className='flex-1 mt-11 flex items-center justify-center'>
//                     <ActivityIndicator size="large" color="#4338ca" />
//                   </View> :
//                   <View className='items-center my-5'><Text className='font-bold text-[15px]'>Records not found</Text></View>
//               )
//           }
//           <View className='flex-row justify-end mx-4'>
//             <TouchableOpacity
//               disabled={currentPage === 0}
//               onPress={() => handlePageChange(currentPage - 1)}
//               className="bg-gray-400 py-1 px-3.5 rounded-[10px] h-[28px]"
//             >
//               <Text className="text-white text-[14px]">Prev</Text>
//             </TouchableOpacity>

//             {
//               pageIndex.slice(
//                 Math.max(0, currentPage - 2),
//                 Math.min(numberOfPage, currentPage + 3)
//               ).map((page) => (
//                 <TouchableOpacity
//                   disabled={currentPage >= numberOfPage - 1}
//                   onPress={() => handlePageChange(page - 1)}
//                   key={page} // Add key prop
//                   className='h-[27px]'
//                   style={[
//                     styles.paginationButton,
//                     currentPage + 1 === page && styles.activePaginationButton,
//                     currentPage + 1 !== page && styles.inactivePaginationButton,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.paginationButtonText,
//                       currentPage + 1 === page && styles.activePaginationButtonText,
//                       currentPage + 1 !== page && styles.inactivePaginationButtonText,
//                     ]}
//                   >
//                     {page}
//                   </Text>
//                 </TouchableOpacity>
//               ))}

//             <TouchableOpacity
//               disabled={currentPage >= numberOfPage - 1}
//               onPress={() => handlePageChange(currentPage + 1)}
//               className="bg-indigo-700 py-1 px-3.5 rounded-[10px] mb-10 h-[28px]"
//             >
//               <Text className="text-white text-[14px]">Next</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>

//     </View>
//   )
// }

// const UpdateModal = (props) => {

//   const [updateCounter, setUpdateCounter] = useState(String(props.selectedUser.NoOfPrayers));

//   console.log('no of prayerss', updateCounter);
//   console.log('All counterrr', props.selectedUser);
//   const id = props.selectedUser.TID;
//   console.warn(`url hai update waly ka ${url2}${id}/`)

//   console.log(`${url2}${id}`, 'ksksks')

//   const UpdateNamaz = async () => {
//     const id = props.selectedUser.TID;
//     try {
//       let response = await fetch(`${update_url}${id}/`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           NoOfPrayers: updateCounter
//         })
//       })

//       props.setUpdateModal(false);
//       props.getAPI_Manage_Data(props.selectedDate, props.selectClassId);

//       if (!response.ok) {
//         console.log('jdjdjdjdjdj', response.status);
//         throw new Error("Failed to update data");
//       }

//       let result = await response.json();
//       console.log(result, response.status);
//       console.warn('Respaonse states', response.status);
//       console.warn('Respaonse statcccccccccccccccccces');
//       // props.getAPI_Manage_Data();

//     }
//     catch (error) {
//       console.error("Error updating data:", error.message);
//     }
//   }

//   return (
//     <View className='flex-1 justify-center'>
//       <View className='bg-white rounded-3xl px-5 py-4 mx-6 border border-gray-400'>

//         <Text className='text-2xl font-bold'>Update Your Data!</Text>
//         <Text className="ml-1 mb-1 text-[16px] mt-1">
//           Prayer Counter:{" "}
//           <Text className="text-red-600 font-bold text-[15px]">*</Text>
//         </Text>
//         <TextInput
//           className="text-[16px] border border-gray-400 p-3 rounded-xl mb-3"
//           placeholder="Edit your Namaz Quantity..."
//           value={updateCounter}
//           onChangeText={(text) => setUpdateCounter(text)}
//         />

//         <View className='flex-row justify-end'>
//           <TouchableOpacity className='bg-gray-500 px-5 py-3 rounded-xl mr-5' onPress={() => props.setUpdateModal(false)}>
//             <Text className='text-white font-bold text-center sm:text-[20px]'>Close</Text>
//           </TouchableOpacity>
//           <TouchableOpacity className='bg-indigo-700 px-5 py-3 rounded-xl' onPress={UpdateNamaz}>
//             <Text className='text-white font-bold text-center sm:text-[20px]'>Update</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   )
// }

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingTop: 0
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
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 30,
    backgroundColor: "#fff",
    width: "100%",
  },
  rowSection: {
    height: 60,
    backgroundColor: "white",
    width: 599,
  },
  head: {
    height: 55,
    width: 600,
    backgroundColor: "#4338ca",
  },
  headText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  text: {
    margin: 6,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
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
