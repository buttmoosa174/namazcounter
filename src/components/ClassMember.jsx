import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, Button, FlatList, Modal, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from '@expo/vector-icons';
import { useCardNo } from "../Store/CardNoContext";

// const url = 'http://125.209.66.227:8020/api/Class_Member/';
const url = 'http://125.209.66.227:8020/api/Class_Member/NamazData/';
const url2 = 'http://125.209.66.227:8020/api/Class_Member/';

const itemPerPage = 8;

const ClassMember = () => {

  const [value, setValue] = useState(null);
  const [cardValue, setCardValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isCardFocus, setIsCardFocus] = useState(false);
  const [data, setData] = useState([]); //api state 
  const [currentPage, setCurrentPage] = useState(0);

  const [delModalVisible, setDelModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [classDisplayData, setClassDisplayData] = useState('');

  const [updateStatus, setUpdateStatus] = useState(false);
  const [getClass, setClass] = useState([]);
  const [ClassCardNo, setClassCardNo] = useState([]);
  const [selectClassId, setSelectClassId] = useState('');
  const { cardNo } = useCardNo();

  const deleteAPIData = (id) => {
    setSelectedUser(id);
    setDelModalVisible(true);
    // console.log('Delet testing, but not deletedkkkkkkkkkkkkk', id);
  };

  const updateAPIData = (id) => {
    setSelectedUser(id);
    setUpdateStatus(true);
  }

  const rows = data.slice(
    currentPage * itemPerPage,
    currentPage * itemPerPage + itemPerPage
  );
  const numberOfPage = Math.ceil(data.length / itemPerPage);
  const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log(classDisplayData, 'testststststststststsststst')
  const getClassApi = async () => {
    try {
      let result = await fetch('http://125.209.66.227:8020/api/Namaz_Class/');

      if (!result.ok) {
        throw new Error("Failed to fetch data");
      }

      let res = await result.json();
      let classData = res.filter(item => item.HeadCardNo == cardNo || item.CardNo == cardNo || item.CardNo2 == cardNo);
      const updatedClassMember = classData.map(item => ({
        label: item.Class,
        value: item.Class,
        classId: item.TID
      }));
      setClass(updatedClassMember);

      // Set default value to the first class in the list
      if (updatedClassMember.length > 0) {
        setValue(updatedClassMember[0].value);
        getAPIData(updatedClassMember[0].classId); // Fetch prayer data for the default selected class
      }

      console.log('class is', classData)
      console.log('classsasasa is', classData.map(item => item.Class));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getClassCardNoApi = async () => {
    try {
      let result = await fetch('http://125.209.66.227:8020/api/Class_Member/');

      if (!result.ok) {
        throw new Error("Failed to fetch data");
      }

      let res = await result.json();
      let classData = res.filter(item => item.HeadCardNo == cardNo || item.HeadCardNo2 == cardNo);

      const updateCardNo = classData.map(item => ({
        label: item.CardNo.toString(),
        value: item.CardNo.toString(),
      }));
      setClassCardNo(updateCardNo);

      console.log('class is', classData)
      console.log('classsasasa is', classData.map(item => item.Class));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAPIData = async (classId) => {
    try {
      let result = await fetch(url);

      if (!result.ok) {
        throw new Error('Failed to fetch data');
      }

      let res = await result.json();
      // Filter the API data to get only the data for the "Selected" class
      const ClassMemberFliter = res.filter(item => (item.HeadCardNo === cardNo || item.HeadCardNo2 === cardNo) && (item.ClassID === classId));
      setData(ClassMemberFliter);
      setClassDisplayData(classId);
      // console.warn('class id in get response function', classDisplayData)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getClassApi();
    getClassCardNoApi();
  }, []);

  // useEffect(() => {
  //     getAPIData(selectClassId);
  // }, [selectClassId]);

  return (
    <View className='flex-1 bg-white pt-5'>

      {/* Deletion Modal Start Here */}
      <View>
        <Modal
          visible={delModalVisible}
          animationType="fade"
          transparent={true}
        >
          <DeleteModal setDelModalVisible={setDelModalVisible} deleteAPIData={deleteAPIData} selectedUser={selectedUser} getAPIData={getAPIData} />
        </Modal>
      </View>
      {/* Deletion Modal End Here */}

      {/* Update Modal Start Here*/}
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={updateStatus}
        >
          <UpdateStatus setUpdateStatus={setUpdateStatus} updateAPIData={updateAPIData} selectedUser={selectedUser} getAPIData={getAPIData} classDisplayData={classDisplayData} />
        </Modal>
      </View>
      {/* Update Modal End Here*/}

      <View className='mx-4'>
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
            setSelectClassId(item.classId)
            getAPIData(item.classId)
          }}
        />
      </View>


      {/* <View className='mx-4'>
        <Dropdown
          style={[styles.dropdown, isCardFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={ClassCardNo}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isCardFocus ? "Select CardNo" : "..."}
          searchPlaceholder="Search..."
          value={cardValue}
          onFocus={() => setIsCardFocus(true)}
          onBlur={() => setIsCardFocus(false)}
          onChange={(item) => {
            setCardValue(item.cardValue);
            setIsCardFocus(false);
          }}
        />
      </View> */}

      {/* <View className='flex-row justify-center'>
        <TouchableOpacity className="bg-indigo-700 py-2 px-4 rounded-full">
          <Text className="text-[18px] text-white text-center font-bold">
            ADD
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* API display start here */}
      <View className='flex-1 h-screen'>
        <ScrollView>
          {data.length > 0 ? (
            rows.map((item) => (
              <View className="mt-4 mx-4" key={item.TID}>
                <View className="border-b-2 border-gray-400">
                  <View className="flex-row items-center mb-1 bg-indigo-700 rounded-lg">
                    <Text className="font-bold text-[16px] text-white px-3 py-2 w-[33%]">
                      Class:
                    </Text>
                    <Text className="text-[14px] text-white">{item.Class}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[33%]">
                    Card NO:
                  </Text>
                  <Text className="text-[14px]">{item.CardNo}</Text>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[33%]">
                    Name:
                  </Text>
                  <Text className="text-[14px]">{item.ClassMemberName}</Text>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[33%]">
                    Department:
                  </Text>
                  <Text className="text-[14px]">{item.deptName}</Text>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[33%]">
                    Designation:
                  </Text>
                  <Text className="text-[14px]">{item.Designation}</Text>
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[33%]">
                    Status:
                  </Text>
                  {
                    item.Status == 1
                      ?
                      <View className='bg-indigo-700 rounded-md'>
                        <Text className="text-[14px] text-white py-0.5 px-3">{item.Status}Active</Text>
                      </View>
                      :
                      <View className='mr-4 bg-pink-600 rounded-md'>
                        <Text className='text-white py-0.5 px-3'>Inactive</Text>
                      </View>
                  }
                </View>

                <View className="flex-row items-center mb-1 border-b-2 border-gray-400">
                  <Text className="font-bold text-[16px] px-3 py-1 w-[33%]">
                    Action:
                  </Text>
                  <View className='flex-row'>
                    {
                      item.Status == 0 ?
                        <TouchableOpacity onPress={() => updateAPIData(item)} className='mr-4 bg-indigo-700 rounded-md'>
                          <Text className="text-[14px] text-white py-0.5 px-3">Active</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => updateAPIData(item)} className='mr-4 bg-pink-600 rounded-md'>
                          <Text className='text-white py-0.5 px-3'>Inactive</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={() => {
                      deleteAPIData(item)
                    }}>
                      <Ionicons name="trash-bin" size={23} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            ))
          ) : (
            <View className='flex-1 mt-11 flex items-center justify-center'>
              <ActivityIndicator size="large" color="#4338ca" />
            </View>
          )}

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
      {/* Api display end here */}

    </View>
  );
};

// export default ClassMember;

const MemoizedClassManagement = React.memo(ClassMember);

export default MemoizedClassManagement;

const styles = StyleSheet.create({
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
    backgroundColor: 'lightgray',
  },
  activePaginationButton: {
    backgroundColor: '#4338ca',
  },
  inactivePaginationButton: {
    backgroundColor: 'gray',
  },
  paginationButtonText: {
    fontSize: 13,
    color: 'black',
  },
  activePaginationButtonText: {
    color: 'white',
  },
  inactivePaginationButtonText: {
    color: 'black',
  },
});

const DeleteModal = (props) => {

  const deleteUser = async (id) => {
    try {
      let result = await fetch(`${url2}${id}/`, {
        method: "DELETE",
      });
      if (!result.ok) {
        const errorMessage = await result.text();
        throw new Error(`Failed to delete user. Server response: ${errorMessage}`);
      }
      // result = await result.json();
      props.getAPIData();
      if (result) {
        // console.warn("User Deleted", result);
      }
      console.log("This User is Deleted", result);
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
    // console.warn('testinggggggg', props.selectedUser);
    console.log('Delet testing, ttttttttttttttttttt', id);
    console.log('Type hai bhai', typeof (id));
    console.log(`url hai bhai: ${url}${id}/`)
  };

  // console.warn(props.selectedUser);
  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-white rounded-3xl items-center px-5 py-4 mx-6 border border-gray-400">
        <Text className="text-[22px] sm:text-[24px] font-bold mb-4">
          Do you Really Want to Delete?
        </Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => props.setDelModalVisible(false)}
            className="bg-gray-500 px-5 py-3 rounded-xl mr-5"
          >
            <Text className="text-white font-bold text-center sm:text-[20px]">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteUser(props.selectedUser.TID)}
            className="bg-indigo-700 px-5 py-3 rounded-xl"
          >
            <Text className="text-white font-bold text-center sm:text-[20px]">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const UpdateStatus = (props) => {
  const [loading, setLoading] = useState(false);

  const toggleStatus = () => {
    const newStatus = !props.selectedUser.Status; // Toggle status
    const id = props.selectedUser.TID;

    setLoading(true);
    fetch(`${url2}${id}/`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Status: newStatus }) // Include new status in request body
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to update data");
        }
        props.setUpdateStatus(false);
        props.getAPIData(props.classDisplayData); // Refresh data after successful update
      })
      .catch(error => {
        console.error("Error updating data:", error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <View className='flex-1 justify-center items-center'>
      <View className='bg-white rounded-3xl items-center px-5 py-4 mx-6 border border-gray-400'>
        <Text className='text-[22px] mb-3 font-bold'>
          Do you want to {props.selectedUser.Status == 1 ? "Inactivate" : "Activate"} the employee?
        </Text>
        <View className='flex-row'>
          <TouchableOpacity onPress={() => props.setUpdateStatus(false)} className='bg-gray-500 px-5 py-3 rounded-xl mr-5'>
            <Text className='text-white font-bold text-center sm:text-[20px]'>No</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleStatus} className={`bg-indigo-700 px-5 py-3 rounded-xl ${loading ? 'opacity-50' : ''}`}>
            <Text className='text-white font-bold text-center sm:text-[20px]'>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};