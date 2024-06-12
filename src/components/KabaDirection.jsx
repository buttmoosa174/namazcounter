import { View, Text } from 'react-native'
import QiblaCompass from "react-native-qibla-compass";
import React from 'react';


export default function KabaDirection() {
  return (
    <View className="flex-1 bg-white pt-4 items-center justify-between">
      {/* <View className='flex-1 items-center justify-center'> */}
        <View>
        <Text className='text-[24px] text-center font-bold'>Direction to Qibla (100% Accurate)</Text>
        </View>

        <View>
          {/* <View className='mt-[60px]'> */}
          <QiblaCompass
            // color={"#123"} // optional
            backgroundColor={"#fff"} // optional
            textStyles={{ textAlign: "center", fontSize: 24 }} // optional
          //   kaabaImage={require('./assests/kaaba.png')} // optional
          //   compassImage={require('./assets/compass.png')} // optional
          />
        </View>
        {/* mt-7 */}
        <View className='bg-yellow-200 rounded-lg mx-3 mb-5'>
          <Text className='text-[18px] text-center p-3 pb-0' >Please keep magnetic & electronic devices at least <Text className='font-bold text-[20px]'>1ft</Text> away to ensure accurate <Text className='font-bold text-[20px]'>Qibla direction.</Text></Text>
          <Text className='text-[18px] text-center p-3'>قبلہ کی درست سمت کو یقینی بنانے کے لیے براہ کرم مقناطیسی اور الیکٹرانک آلات کو کم از کم 1 فٹ دور رکھیں۔</Text>
        </View>
      {/* </View> */}

      {/*       
      <View className='flex-1 justify-center items-center'>
        <View className='mx-3 border border-gray-400 rounded-2xl items-center bg-gray-200 mt-9'>
          <Text className='p-3 text-[18px] font-bold'>اور نماز قائم کرو اور زکوٰة دو۔ اور جو بھلائی تم اپنے لیے آگے بھیجو گے، اسے اللہ کے ہاں پاؤ گے۔ بے شک اللہ تمہارے اعمال کو خوب دیکھ رہا ہے۔
          </Text>
        </View>
      </View> */}
    </View>
  )
}