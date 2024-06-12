import { View, Text, Button, Image } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';

export default function OnBoardingScreen({ navigation }) {
    return (
        <View className='flex-1'>
            <Onboarding
                onSkip={
                    () => navigation.replace('Login')
                }
                onDone={
                    () => navigation.replace('Login')
                }
                pages={[
                    {
                        backgroundColor: '#fdeb93',
                        image: <Image className='h-[200px] w-[200px]' source={require('../img/OnBoarding-1.png')} />,
                        title: 'Welcome to Prayer Counter',
                        subtitle: 'Connect to the Prayer Counter App',
                    },
                    {
                        backgroundColor: '#a6e4d0',
                        image: <Image className='h-[200px] w-[200px]' source={require('../img/OnBoarding-2.png')} />,
                        title: 'Track Your Prayers',
                        subtitle: 'Effortlessly keep track of your daily prayers with our intuitive tracking system.',
                    },
                    {
                        backgroundColor: '#4338ca',
                        image: <Image className='h-[200px] w-[200px]' source={require('../img/OnBoarding-3.png')} />,
                        title: 'Let Started & Stay Motivated',
                        subtitle: 'Connect with like-minded individuals in our community and share the prayers that you offer.',
                    },
                ]}
            />
        </View>
    )
}

