import React, { useState } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Button ,TextInput} from 'react-native';
import * as Facebook from 'expo-facebook';
// 제가 리액트네이티브를 처음에 expo로 배워서 당연히 expo로 하실줄 알고 expo로 개발을 했습니다..
// react native cli에서 실행될까 걱정이.. + 일단 결과물을 만들어야해서 컴포넌트 나누고 그러진 못했습니다..

console.disableYellowBox = true;

export default function App() {

  login = (email, pass) => {
    alert("email : " + email + "   password : " + pass);
  }; // 일단 변수에 입력값이 저장되는지 확인하기 위해 로그인 함수를 만들었습니다.


 // state 관리 : [변수, set함수] = useState(초기값);
  const [isLoggedin, setLoggedinStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isImageLoading, setImageLoadStatus] = useState(false);
  // facebook Login variable
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // sign in variable

  facebookLogIn = async () => { // 이건 페이스북 sns 로그인에서 따왔습니다(https://docs.expo.io/versions/latest/sdk/facebook/)
    try {
      await Facebook.initializeAsync('2673125552909503'); // appId(facebook developer에서 앱 등록한 ID입니다.)
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
          .then(response => response.json())
          .then(data => {
            setLoggedinStatus(true);
            setUserData(data);
          })
          .catch(e => console.log(e))
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  logout = () => {
    setLoggedinStatus(false);
    setUserData(null);
    setImageLoadStatus(false);
  } // logout 함수 (지금 페이스북로그인이 완료되면 다음화면에서 name과 picture에 접근 txt & 로그아웃버튼이 있습니다.)
    // 그 로그아웃버튼을 누를때 호출되는 함수입니다.


  return (
    isLoggedin ?
      userData ? // true시 로그인완료화면 띄우는것
        <View style={styles.container}>
          <Image
            style={{ width: 200, height: 200, borderRadius: 50 }}
            source={{ uri: userData.picture.data.url }}
            onLoadEnd={() => setImageLoadStatus(true)} />
          <ActivityIndicator size="large" color="#0000ff" animating={!isImageLoading} style={{ position: "absolute" }} />
          <Text style={{ fontSize: 22, marginVertical: 10 }}>Hi {userData.name}!</Text>
          <TouchableOpacity style={styles.facebook_logoutBtn} onPress={logout}>
            <Text style={{ color: "#fff" }}>Logout</Text>
          </TouchableOpacity>
        </View> :
        null
      : 
      // 로그인성공전(로그인 대기화면) 로고와 id, pw 입력창 등등 ui 구성요소들 / 
      // % 이용해서 height을 조절하려고했는데 로그인시 키패드가 올라오면서 높이가 줄어들면서 위치가 변해서 일단 절대값들을 넣어놨습니다.
      // + 로고 png는 은비한테 뒤에 배경 좀 없애달라고 부탁해놨었습니다.. 받진 못했어요 ㅜ.ㅜ 
      // 지금은 제가 따로 배경을 지웠지만 toon 옆의 여우?얼굴 배경까지 날라갔습니다..
<View style = {styles.container}>

        <View style = {styles.header}></View>

          <View style = {styles.LogoContainer}>
              <Image
                style={styles.loginLogo}
                source={require("./assets/login_maker-remove.png")} />
          </View> 
        
        <View style = {styles.inputBox}>
          <Text style = {styles.inputText}>아이디</Text>

          <TextInput style = {styles.inputTextID}
                    underlineColorAndroid="transparent"
                    placeholder="ID"
                    placeholderTextColor="black"
                    autoCapitalize="none"
          onChangeText={setEmail}></TextInput>
        
        </View>

        <View style = {styles.inputBox}>
          <Text style = {styles.inputText} >비밀번호</Text>
          
          <TextInput style = {styles.inputTextPW}
                    underlineColorAndroid="transparent"
                    placeholder="Password"
                    placeholderTextColor="black"
                    autoCapitalize="none"
                    secureTextEntry = {true}
          onChangeText={setPassword}></TextInput>
        </View>

        <View style = {styles.loginBox}>
          <TouchableOpacity style={styles.loginBtn}>
            <Text onPress = {() => login(email, password)}> 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn}>
            <Text onPress = {() => alert('아이디/비밀번호 찾기')}>아이디/비밀번호 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn}>
            <Text onPress = {() => alert('회원가입')}> 회원가입</Text>
          </TouchableOpacity>                    
        </View>

        <View style = {styles.footer}>

        </View>
        <TouchableOpacity style={styles.facebook_loginBtn} onPress={facebookLogIn}>
          <Text style={{ color: "#fff" }}>Facebook으로 계속하기</Text>
        </TouchableOpacity>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  header : {
    width : '100%',
    height : 100,
    //backgroundColor : "pink",
  },
  LogoContainer : {
    width: '100%',
    height : 200,
    //backgroundColor : "yellow"
  },
  loginLogo: {
    resizeMode : "contain",
  },
  inputBox : {
    flexDirection : "row",
    width : "100%",
    height : 65,
    //backgroundColor : "purple",
    alignItems : 'center',
  },
  inputText : {
    alignItems : "center",
    paddingLeft : 30,
  },
  inputTextID : {
    alignItems : "center",
    paddingLeft : 73,
  },
  inputTextPW : {
    alignItems : "center",
    paddingLeft : 60,
  },
  loginBox : {
    marginTop : 10,
    flexDirection : "row",
    width : "100%",
    //backgroundColor : "black",
    height : 40,
  },
  loginBtn : {
    paddingTop : 10,
    height : "100%",
    backgroundColor : "white",
    flex : 1,
    alignItems : "center",
  },
  facebook_loginBtn: {
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  facebook_logoutBtn: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: "absolute",
    bottom: 0
  },
  footer: {
    width:'100%',
    height:'15%',
    //backgroundColor: '#1ad657',
  },
});