import axios from 'react-native-axios';
import CryptoJS from "react-native-crypto-js";
import { Alert } from "react-native";

export const handleLogin = async ( postData, password, navigation, setCardNo, setPassword, setUsername, setDepName, setUserPic, setDepId ) => {
 
  await axios.post( 'http://125.209.66.227:8010/api/login/check_credentials/', postData ) .then( ( response ) => {
  // await axios.post( 'http://125.209.66.227:2000/api/login/check_credentials/', postData ) .then( ( response ) => {

        console.log( "here", response );
        const data          = response.data;
        const encryptedData = data.encypt;

        console.log('encrypted password', encryptedData);

        const decryptedBytes = CryptoJS.AES.decrypt( encryptedData, 'Password@2022' ).toString( CryptoJS.enc.Utf8 );
        console.log('Decrypted password:', decryptedBytes);

        if ( !( decryptedBytes.replace( /"/g, "" ) === password ) || !data[ 'picture' ][ 'CardNo' ] ) {

            Alert.alert( "The Credentials you entered is incorrect. Please try again" );

        } else {

          navigation.navigate( "Home" );
          console.log( "matched password" );
          const card_number  = data[ 'picture' ][ 'CardNo' ];
          const department   = data[ 'companyInfo' ][ 'Department' ][ 'name' ];
          const departmentId = data[ 'companyInfo' ][ 'Department' ][ 'id' ];
          const username     = data[ 'picture' ][ 'name' ];
          const userImage    = data[ 'picture' ][ 'EmpPic' ];
          setCardNo( card_number );
          setUsername( username );
          setDepName( department );
          setDepId( departmentId );
          setUserPic( userImage );
          setPassword();
          // console.warn('department name testing', department);

        }

    }) .catch( ( error ) => {

      // console.error( 'Error Catch:', error.message );
      Alert.alert("The Credentials you entered is incorrect or empty. Please try again", error.message);

    });
}; 

/*
import axios from 'react-native-axios';
import CryptoJS from "react-native-crypto-js";
import { Alert } from "react-native";

export const handleLogin = async (postData, password, navigation, setCardNo, setPassword, setUsername) => {
  try {
    // Send a POST request to the server to check credentials
    const response = await axios.post('http://125.209.66.227:8010/api/login/check_credentials/', postData);

    // Retrieve data from the response
    const data = response.data;
    const encryptedData = data.encypt;

    // Decrypt the encrypted password
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, 'Password@2022').toString(CryptoJS.enc.Utf8);

    // Check if decrypted password matches the input password
    if (!(decryptedBytes.replace(/"/g, "") === password) || !data['picture']['CardNo']) {
      // If credentials are incorrect, display an alert message
      Alert.alert("The credentials you entered are incorrect. Please try again.");
    } else {
      // If credentials are correct, navigate to the Home screen
      navigation.navigate("Home");

      // Retrieve the card number and username from the response
      const cardNumber = data['picture']['CardNo'];
      const username = data['picture']['name'];

      // Set the card number, password, and username in the application state
      setCardNo(cardNumber);
      setPassword();
      setUsername(username);
    }
  } catch (error) {
    // Handle any errors that occur during the login process
    console.error('Error:', error.message);
    // Alert.alert("The credentials you entered are incorrect. Please try again.", error.message);
  }
};
 */