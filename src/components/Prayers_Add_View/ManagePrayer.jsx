import { View, StyleSheet, Text, Modal, Button, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from "react-native-element-dropdown";
import { Calendar } from "react-native-calendars";
import { FontAwesome6 } from '@expo/vector-icons';

import { useCardNo } from "../../Store/CardNoContext";
import Update_data_modal from './Update_data_modal';

const Prayer_Class_API = "http://125.209.66.227:8020/api/Namaz_Class/";  //Classes API
const Display_Prayer_Result_API = "http://125.209.66.227:8020/api/Namaz_Class/getSubordinates/";

export default function ManagePrayer() {

    const { cardNo } = useCardNo();
    const [value, setValue] = useState();
    const [isFocus, setIsFocus] = useState(false);
    const [selectClassId, setSelectClassId] = useState();
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [getClass, setGetClass] = useState([]);
    const [apiData, setApiData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(undefined);



    const itemPerPage = 8;
    const rows = apiData.slice(
        currentPage * itemPerPage,
        currentPage * itemPerPage + itemPerPage
    );
    const numberOfPage = Math.ceil(apiData.length / itemPerPage);
    const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const Display_Namaz_Result = async (date, classId) => {
        const Input_Data = {
            ClassID: classId,
            Date: date,
        }

        try {
            const response = await fetch(Display_Prayer_Result_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Input_Data),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();
            console.log(result);
            setApiData(result);
        } catch (error) {
            console.error('Fetching error', error.message);
        }
    }

    const getClassApi = async () => {
        try {
            let result = await fetch(Prayer_Class_API);

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
            setGetClass(updatedClassMember);
            console.log('class is', classData);
            // Set default value to the first class in the list
            // if (updatedClassMember.length > 0) {
            //     setValue(updatedClassMember[0].value);
            //     Display_Namaz_Result(selectedDate, updatedClassMember[0].classId); // Fetch prayer data for the default selected class
            // }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const updateAPIData = async (id) => {
        setUpdateModal(true);
        setSelectedUser(id);
    }

    const formatDate = (date) => {
        const yesterday = new Date(date);
        yesterday.setDate(date.getDate() - 1); // Subtract 1 to get yesterday's date
        const year = yesterday.getFullYear();
        const month = (yesterday.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
        const day = yesterday.getDate().toString().padStart(2, '0'); // Add leading zero if needed
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        getClassApi();
        // setSelectedDate(formatDate(new Date()));
    }, []);

    return (
        <View className='flex-1 bg-white px-5'>

            <View>
                <Modal animationType="fade" visible={updateModal} transparent={true}>
                    <Update_data_modal selectedUser={selectedUser} setUpdateModal={setUpdateModal} getAPI_Manage_Data={Display_Namaz_Result} selectClassId={selectClassId} selectedDate={selectedDate} />
                </Modal>
            </View>

            <Text className="text-center text-2xl font-bold mb-5">Manage Prayer</Text>

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
                    setIsFocus(false);
                    setSelectClassId(item.classId);
                    // Display_Namaz_Result(item.classId);
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

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="bg-white border border-gray-400 p-3 rounded-lg"
            >
                <Text className="border-gray-950 text-[16px]">
                    {selectedDate ? selectedDate : 'Select Date'}
                </Text>
            </TouchableOpacity>

            {/* Search Button */}
            <View className="flex-row justify-center mt-5">
                <TouchableOpacity
                    onPress={() => Display_Namaz_Result(selectedDate, selectClassId)}
                    className="bg-indigo-700 py-2 px-4 rounded-full">
                    <Text className="text-[18px] text-white text-center font-bold">
                        Search
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Search Button end */}



            <ScrollView className='mb-5'>
                <View>
                    {
                        apiData.length ?
                            rows.map((item) => (
                                <View className="mt-4 mx-1" key={item.TID}>
                                    <View className="border-b-2 border-gray-400">
                                        <View className="flex-row items-center mb-1 bg-indigo-700 rounded-lg">
                                            <Text className="font-bold text-[16px] text-white px-3 py-2 w-[40%]">
                                                Class:
                                            </Text>
                                            <Text className="text-[14px] text-white">{item.MemberClass}</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                                        <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                                            Card NO:
                                        </Text>
                                        <Text className="text-[14px]">{item.SubordinateCardNo}</Text>
                                    </View>

                                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                                        <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                                            Name:
                                        </Text>
                                        <Text className="text-[14px] font-bold">{item.ClassMemberName}</Text>
                                    </View>

                                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                                        <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                                            Department:
                                        </Text>
                                        <Text className="text-[14px]">{item.DepartmentName}</Text>
                                    </View>

                                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                                        <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                                            Designation:
                                        </Text>
                                        <Text className="text-[14px]">{item.DesignationName}</Text>
                                    </View>

                                    {/* <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
    <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
      Entry Date:
    </Text>
    <Text className="text-[14px]">{item.EntryDate}</Text>
  </View> */}

                                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                                        {/* <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
      Actual Date:
    </Text> */}
                                        <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                                            Entry Date:
                                        </Text>
                                        <Text className="text-[14px]">{item.Date}</Text>
                                    </View>

                                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                                        <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                                            Prayer Counter:
                                        </Text>
                                        <Text className="text-[15px] font-bold">{item.NoOfPrayers}</Text>
                                    </View>

                                    <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                                        <Text className="font-bold text-[16px] px-3 py-1 w-[40%]">
                                            Action:
                                        </Text>
                                        <View className='flex-row'>
                                            <TouchableOpacity onPress={() => updateAPIData(item)} className='mr-4'>
                                                <FontAwesome6 name="edit" size={21} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )) :
                            (
                                apiData.length ?
                                    <View className='flex-1 mt-11 flex items-center justify-center'>
                                        <ActivityIndicator size="large" color="#4338ca" />
                                    </View> :
                                    <View className='items-center my-5'><Text className='font-bold text-[15px]'>Records not found</Text></View>
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
                </View>
            </ScrollView>



        </View>
    )
}
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
})