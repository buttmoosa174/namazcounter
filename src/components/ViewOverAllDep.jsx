import { View, Text, Modal, StyleSheet ,ScrollView, Button } from "react-native";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SearchBar } from '@rneui/themed';
import { Row, Rows, Table } from "react-native-table-component";

const tableData = {
  tableHead: [
    "Department",
    '2024-04-01',
    '2024-04-02',
    '2024-04-03',
    '2024-04-04',
    '2024-04-05',
    '2024-04-06',
    '2024-04-06',
    'Prayer Percentage',
  ],
  tableData: [
    [
      'Information Technology',
      '5%',
      '5%',
      '5%',
      '5%',
      '5%',
      '',
      '',
      '95%',
    ],
    [
      'Software Development',
      '5%',
      '5%',
      '5%',
      '5%',
      '5%',
      '',
      '',
      '95%',
    ],
    [
      'Chahat Fateh Ali Khan',
      '5%',
      '5%',
      '5%',
      '5%',
      '5%',
      '',
      '',
      '95%',
    ],
    [
    'Average Factory Prayers Percentage',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '90%',
    ]
  ],
}

export default function ViewOverAllDep() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState(tableData);

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <View className='flex-1 bg-white'>

      <Text className='text-center text-2xl font-bold my-3'>Overall Department Prayers Percentage</Text>

      <View>
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View className="flex-1 items-center justify-center">
            <View className="border border-gray-300">
              <Calendar
                className="border border-gray-400"
                onDayPress={(day) => {
                  setSelected(day.dateString);
                  console.log("selected day", day);
                }}
                markedDates={{
                  [selected]: { selected: true },
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
      </View>

      <View className='mx-4'>
        <Text className='ml-1 mb-1'>Search By Month:</Text>
      </View>
      <View className='items-center justify-between flex-row mx-4 mb-4 bg-white border border-gray-400 rounded-lg p-2'>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className='w-[290px]'
        >
          <Text className="border-gray-950 text-[16px]">Calendar</Text>
        </TouchableOpacity>
        <View className=''>
          <Button title="Search" color={'#4338ca'} />
        </View>
      </View>

      <View className='mx-4 border border-gray-400'>
        <SearchBar
          platform="android"
          onChangeText={updateSearch}
          placeholder="Search here..."
          placeholderTextColor="#888"
          value={search}
        />
      </View>

       {/* Table Start here */}
       <ScrollView horizontal={true} style={styles.container}>
        <ScrollView className='mr-5'>
          <Table className="mb-0">
            <Row
              className="rounded-t-lg"
              data={data.tableHead}
              style={styles.head}
              textStyle={styles.headText}
            />
          </Table>
          <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
            <Rows data={data.tableData} textStyle={styles.text} style={styles.rowSection} />
          </Table>
        </ScrollView>
      </ScrollView>
      {/* Table end here */}

    </View>
  );
}


const styles = StyleSheet.create({
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
    width: 699,
  },
  head: {
    height: 55,
    width: 700,
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
});
