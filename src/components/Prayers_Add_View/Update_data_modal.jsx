import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";


const update_url = "http://125.209.66.227:8020/api/Namaz_Counter/"; // update User Info api 
const url2 = "http://125.209.66.227:8020/api/Namaz_Counter/NamazData/";
export default function Update_data_modal(props) {
    const [updateCounter, setUpdateCounter] = useState(String(props.selectedUser.NoOfPrayers));

    console.log('no of prayerss', updateCounter);
    console.log('All counterrr', props.selectedUser);
    const id = props.selectedUser.TID;
    // console.warn(`url hai update waly ka ${url2}${id}/`);

    console.log(`${url2}${id}`, 'ksksks')

    const UpdateNamaz = async () => {
        const id = props.selectedUser.TID;
        try {
            let response = await fetch(`${update_url}${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    NoOfPrayers: updateCounter
                })
            })

            props.setUpdateModal(false);
            props.getAPI_Manage_Data(props.selectedDate, props.selectClassId);

            if (!response.ok) {
                console.log('jdjdjdjdjdj', response.status);
                throw new Error("Failed to update data");
            }

            let result = await response.json();
            console.log(result, response.status);
            // console.warn('Respaonse states', response.status);
            // console.warn('Respaonse statcccccccccccccccccces');
            // props.getAPI_Manage_Data();

        }
        catch (error) {
            console.error("Error updating data:", error.message);
        }
    }

    return (
        <View className='flex-1 justify-center'>
            <View className='bg-white rounded-3xl px-5 py-4 mx-6 border border-gray-400'>

                <Text className='text-2xl font-bold'>Update Your Data!</Text>
                <Text className="ml-1 mb-1 text-[16px] mt-1">
                    Prayer Counter:{" "}
                    <Text className="text-red-600 font-bold text-[15px]">*</Text>
                </Text>
                <TextInput
                    className="text-[16px] border border-gray-400 p-3 rounded-xl mb-3"
                    placeholder="Edit your Namaz Quantity..."
                    value={updateCounter}
                    onChangeText={(text) => setUpdateCounter(text)}
                />

                <View className='flex-row justify-end'>
                    <TouchableOpacity className='bg-gray-500 px-5 py-3 rounded-xl mr-5' onPress={() => props.setUpdateModal(false)}>
                        <Text className='text-white font-bold text-center sm:text-[20px]'>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='bg-indigo-700 px-5 py-3 rounded-xl' onPress={UpdateNamaz}>
                        <Text className='text-white font-bold text-center sm:text-[20px]'>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}