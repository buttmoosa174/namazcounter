import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Yearly_Percentages_Namaz from './Percentage/Yearly_Percentages_Namaz';
import Weekly_Percentages_Namaz from './Percentage/Weekly_Percentages_Namaz';
import Monthly_Percentages_Namaz from './Percentage/Monthly_Percentages_Namaz';
import Yesterday_Percentages_Namaz from './Percentage/Yesterday_Percentages_Namaz';
import PieChart from 'react-native-pie-chart';

export default function Dashboard() {

  const [highlihtBtn, sethighlightBtn] = useState(1);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDay, setCurrentDay] = useState('');
  const formatTime = (time) => {
    return time < 10 ? '0' + time : time;
  };

  const getAMPM = (hour) => {
    return hour >= 12 ? 'PM' : 'AM';
  };

  const formatHour = (hour) => {
    return hour % 12 === 0 ? 12 : hour % 12;
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('en-US', options);

  return (
    <View className='flex-1 bg-white pt-3'>

      <View className='m-2'>
        <View className='relative '>
          <Image source={require('../img/wall2.jpg')} className='h-[180px] w-full rounded-xl' />
        </View>
        <View className='absolute top-8 left-0 ml-5'>
          {/* <Text className='text-white font-bold text-[24px]'>17 Muharram 1446</Text> */}
          <Text className='text-white font-bold text-[24px]'>{formattedDate}</Text>
          <Text className='text-white text-[18px]'>Forward Sports</Text>
          {/* <Text className='text-white text-[18px]'>Sialkot, Pakistan</Text> */}
        </View>
        <View className='absolute top-[50%] left-[31%]'>
          <Text className='text-white font-bold text-[28px]'>
            {formatHour(currentTime.getHours())}:
            {formatTime(currentTime.getMinutes())}:
            {formatTime(currentTime.getSeconds())} {getAMPM(currentTime.getHours())}
          </Text>
        </View>
      </View>

      <View className='flex-row justify-evenly'>
        <TouchableOpacity onPress={() => sethighlightBtn(1)} className={`mx-1 p-2 rounded-xl ${highlihtBtn === 1 ? 'bg-indigo-700' : 'bg-gray-400'}`}>
          <Image source={require('../img/yesterday.png')} className='h-[45px] w-[45px]' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sethighlightBtn(2)} className={`mx-1 p-2 rounded-xl ${highlihtBtn === 2 ? 'bg-indigo-700' : 'bg-gray-400'}`}>
          <Image source={require('../img/week.png')} className='h-[45px] w-[45px]' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sethighlightBtn(3)} className={`mx-1 p-2 rounded-xl ${highlihtBtn === 3 ? 'bg-indigo-700' : 'bg-gray-400'}`}>
          <Image source={require('../img/month.png')} className='h-[45px] w-[45px]' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sethighlightBtn(4)} className={`mx-1 p-2 rounded-xl ${highlihtBtn === 4 ? 'bg-indigo-700' : 'bg-gray-400'}`}>
          <Image source={require('../img/calendar.png')} className='h-[45px] w-[45px]' />
        </TouchableOpacity>
      </View>

      <View>
        {highlihtBtn === 1 ? (
          <Yesterday_Percentages_Namaz />
        ) : highlihtBtn === 2 ? (
          //<Monthly_Percentages_Namaz /> 
          <Weekly_Percentages_Namaz />
        ) : highlihtBtn === 3 ? (
          <Monthly_Percentages_Namaz />
        ) : highlihtBtn === 4 ? (
          <Yearly_Percentages_Namaz />
        ) : null}
      </View>

    </View>
  );
};




