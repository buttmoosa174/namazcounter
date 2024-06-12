import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useCardNo } from '../../Store/CardNoContext';

// const Dep_Percentage_Req_API = 'http://125.209.66.227:8020/api/Namaz_Counter/getYearPercentageData/';
const Dep_Percentage_Req_API = 'http://125.209.66.227:8020/api/Namaz_Counter/getCurrentMonthData/';
const Dept_Member_Count_API = 'http://125.209.66.227:8020/api/Class_Member/';

export default function Yesterday_Percentages_Namaz() {
  const [departmentData, setDepartmentData] = useState([]);
  const [series, setSeries] = useState([]);
  const [DeptCountMember, setDeptCountMember] = useState();
  const { deptId } = useCardNo();


  const sliceColor = ['#fbd203', '#4338ca', '#ff6c00', '#ff3c00', '#fbd9', '#ffb300', '#ce9000', '#ff6c00', '#ff3c00', '#fbd203', '#fbd293', '#4338ca', '#ff6c00', '#ff3c00', '#fbd9', '#ffb300', '#ce9000', '#ff6c00', '#ff3c00'];


  const fetchDepData = async () => {
    try {
      const response = await fetch(Dep_Percentage_Req_API);

      if (!response.ok) {
        throw new Error('Failed to fetch department data');
      }

      const data = await response.json();

      const color_percentage = data.map((item) => item.ClassPercentage);
      setSeries(color_percentage);

      setDepartmentData(data);
      // console.log('data test', data);

      // Check if series sum is zero and log a warning
      // const sumOfSeries = color_percentage.reduce((a, b) => a + b, 0);
      // if (sumOfSeries === 0) {
      //     console.warn('Warning: Sum of series is zero');
      // }
    } catch (error) {
      console.error('Error fetching department data:', error.message);
    }
  };

  const Dept_Counter = async () => {
    try {
      const response = await fetch(Dept_Member_Count_API);
      const res = await response.json();

      // Filter the data to count the Dept Member Count in the database
      let mainDeptMember = res.filter(item => (item.Department == deptId) && (item.Status == true));
      // Count the number of members in the Department
      let mainDeptMemberCount = mainDeptMember.length;
      // console.log('dept member ka  counter', mainDeptMemberCount);
      setDeptCountMember(mainDeptMemberCount);
    } catch (error) {
      console.error('Error fetching department data:', error.message);
    }
  };

  function yesterday_Date() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.getDate();
  }


  useEffect(() => {
    fetchDepData();
    Dept_Counter();
  }, []);

  return (
    <View>
      <Text className='mx-5 text-[20px] font-bold text-center'>Prayer Percentage for the Yesterday</Text>
      {/* <View className='items-center my-5'>
         <PieChart
            widthAndHeight={350}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        </View> */}
      <ScrollView>
        <View className='mb-[90%]'>
          {departmentData.length > 0 ?
            departmentData.map((dept, index) => (
              <View key={index}>
                <View className='flex-row justify-evenly p-2 mx-5 my-2 items-center rounded-lg bg-gray-100'>
                  <View className='w-[33%] h-[45px] justify-center'>
                    <Text style={[styles.colorIndicator, { backgroundColor: sliceColor[index % sliceColor.length] }]}></Text>
                  </View>
                  <View className='w-[33%] h-[45px] justify-center text-wrap'>
                    <Text className='text-[13px] text-wrap font-bold'>{dept[yesterday_Date()] || 0}%</Text>
                  </View>
                  <View className='w-[33%] h-[45px] justify-center text-wrap text-[2px]'>
                    <Text className='text-[13px] text-wrap font-bold'>{dept.DeptName}</Text>
                  </View>
                </View>
              </View>
            )) :
            <View className='flex-1 justify-center items-center mt-[150px]'>
              <ActivityIndicator size="large" color="#4338ca" />
            </View>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  colorIndicator: {
    width: 25,
    height: 25,
    borderRadius: 4,
  },
});