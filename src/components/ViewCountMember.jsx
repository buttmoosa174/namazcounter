//وین وین
import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SearchBar } from "@rneui/themed";
import { Row, Rows, Table } from "react-native-table-component";
import { TouchableOpacity } from "react-native-gesture-handler";

const tableData = {
  tableHead: ["Department	", "Class Name", "Member Count"],
  tableData: [
    ["1st Accounts & Finance", "Accounts And Finance", "839,702,328,904"],
    ["Ethereum", "$3000.9", "563,225"],
    ["Tether", "Gardening", "820,738"],
    ["Administration", "	Admin Team", "144,361"],
    ["AMB Production", "Line 3 5034	", "549"],
    ["Accounts & Finance", "Accounts And Finance", "839,702,328,904"],
    ["Ethereum", "$32222222000.9", "563,225"],
    ["Tether", "Gardening", "820,738"],
    ["Administration", "	Admin Team", "144,361"],
    ["AMB Production", "Line 3 5034	", "549"],
    ["Accounts & Finance", "Accounts And Finance", "839,702,328,904"],
    ["Ethereum", "$3000.9", "563,225"],
    ["Tether", "Gardening", "820,738"],
    ["Administration", "	Admin Team", "144,361"],
    ["AMB Production", "Line 3 5034	", "549"],
    ["Accounts & Finance", "Accounts And Finance", "839,702,328,904"],
    ["Ethereum", "$3000.9", "563,225"],
    ["Tether", "Gardening", "820,738"],
    ["Administration", "	Admin Team", "144,361"],
    ["AMB Production", "Line 3 5034	", "549"],
    ["Accounts & Finance", "Accounts And Finance", "839,702,328,904"],
    ["Ethereum", "$3000.9", "563,225"],
    ["Tether", "Gardening", "820,738"],
    ["Administration", "	Admin Team", "144,361"],
    ["AMB Production", "Line 3 5034	", "549"],
    ["Administration", "	Admin Team123", "144,361"],
    ["AMB Production", "Line 3 5034	", "549"],
    ["Administration", "	Admin Team", "144,361"],
    ["AMB Production", "Line 3 5034	", "549"],
    ["Total", "", "53,633,260,549"],
  ],
};

export default function ViewCountMember() {
  const itemPerPage = 8;

  const [search, setSearch] = useState("");
  const [data, setData] = useState(tableData);
  const [currentPage, setCurrentPage] = useState(0);

  const rows = tableData.tableData.slice(
    currentPage * itemPerPage,
    currentPage * itemPerPage + itemPerPage
  );
  const numberOfPage = Math.ceil(data.tableData.length / itemPerPage);
  const pageIndex = Array.from({ length: numberOfPage }, (_, idx) => idx + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <View className="flex-1 bg-white">
      <Text className="text-center text-2xl font-bold my-3">
        Class Member Count
      </Text>

      <View className="mx-4 border border-gray-400">
        <SearchBar
          platform="android"
          onChangeText={updateSearch}
          placeholder="Search here..."
          placeholderTextColor="#888"
          value={search}
        />
      </View>

      <ScrollView className="mb-11" style={styles.container}>
        <Table className="mb-0">
          <Row
            className="rounded-t-lg"
            data={data.tableHead}
            style={styles.head}
            textStyle={styles.headText}
          />
        </Table>
        <Table borderStyle={{ borderWidth: 1, borderColor: "black" }}>
          <Rows data={rows} textStyle={styles.text} style={styles.rowSection} />
        </Table>

        <View className="flex-row justify-end mt-3 mr-4">
          <TouchableOpacity
            disabled={currentPage === 0}
            onPress={() => handlePageChange(currentPage - 1)}
            className="bg-gray-400 py-1 px-3.5 rounded-[10px]"
          >
            <Text className="text-white text-[14px]">Prev</Text>
          </TouchableOpacity>

          {pageIndex
            .slice(
              Math.max(0, currentPage - 2),
              Math.min(numberOfPage, currentPage + 3)
            )
            .map((page) => (
              <TouchableOpacity
                disabled={currentPage >= numberOfPage - 1}
                onPress={() => handlePageChange(page - 1)}
                key={page}
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
            className="bg-indigo-700 py-1 px-3.5 rounded-[10px] mb-10"
          >
            <Text className="text-white text-[14px]">Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  rowSection: {
    height: 60,
    backgroundColor: "white",
  },
  head: {
    height: 44,
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
