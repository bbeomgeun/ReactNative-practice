import React, { useState } from 'react';
import { KeyboardAvoidingView, KeyboardAwareScrollView, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Button ,TextInput} from 'react-native';
import * as Facebook from 'expo-facebook';


console.disableYellowBox = true;

export default function App() {

  login = (email, pass) => {
    alert("email : " + email + "   password : " + pass);
  };
 // state 관리 : 변수와 set함수 = 초기값 포멧
  const [isLoggedin, setLoggedinStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isImageLoading, setImageLoadStatus] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  facebookLogIn = async () => {
    try {
      await Facebook.initializeAsync('2673125552909503');
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
  }



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
      : // 로그인성공전(로그인 대기화면)
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

// https://yuddomack.tistory.com/entry/React-Navigation%EC%9C%BC%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%ED%83%AD-%EB%84%A4%EB%B9%84%EA%B2%8C%EC%9D%B4%ED%84%B0-%ED%99%94%EB%A9%B4-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0
// 네비게이션 통해서 화면 전환하기.
//https://yuddomack.tistory.com/entry/5React-Native-%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83-%EB%94%94%EC%9E%90%EC%9D%B8-2%EB%B6%80-%EB%B0%B0%EC%B9%98Flex-Direction%EC%99%80-%EC%A0%95%EB%A0%ACjustify-content-align-items?category=754156
//레이아웃 flexDirection ->내일 레이아웃마무리하기. + 구글로그인