import { ZoomMtg } from "@zoomus/websdk";

console.log("checkSystemRequirements");
console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

// it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
// if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.5/lib', '/av'); // CDN version default
// else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.9.5/lib', '/av'); // china cdn option
// ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const API_KEY = "_c6BLOZ_R42gLKnXE0WUbg";

const API_SECRET = "d2jAXjaO0phJwrSVEF9f4YJt9VRhdKluD5mC";

testTool = window.testTool;
let meetingConfig = {}

document.addEventListener("DOMContentLoaded", function(event) {
  // e.preventDefault();

  //get url parameters
  var params = window.location.search
  const urlParams = new URLSearchParams(params)
  meetingConfig.mn = urlParams.get('meetingNumber')
  meetingConfig.nm = urlParams.get('name')
  meetingConfig.userName = urlParams.get('name')
  meetingConfig.role = urlParams.get('role')
  meetingConfig.userEmail = urlParams.get('email')
  meetingConfig.pwd = urlParams.get('password')
  meetingConfig.leaveUrl = urlParams.get('leaveUrl')
  meetingConfig.lang = "en-US"

  // var fullUrl = window.location.pathname.split('/')
  // console.log(fullUrl)


  if (!meetingConfig.mn ) {
    alert("Meeting number or username is empty");
    return false;
  }

  const signature = ZoomMtg.generateSignature({
    meetingNumber: meetingConfig.mn,
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    role: meetingConfig.role,
    success: function (res) {
      console.log(res.result);
      meetingConfig.signature = res.result;
      meetingConfig.apiKey = API_KEY;

      const parsedConfig = createMeetingConfig(meetingConfig);
      //generate meeting details
      // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareJssdk();
      // const joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
      // console.log(joinUrl);
      // window.location = joinUrl
      beginJoin(parsedConfig.signature)


    },
  });

});


//Meeting configutations
function createMeetingConfig (meetingConfigArg) {

  return {
    apiKey: meetingConfigArg.apiKey,
    meetingNumber: meetingConfigArg.mn,
    userName: (function () {
      if (meetingConfigArg.name) {
        try {
          return testTool.b64DecodeUnicode(meetingConfigArg.name);
        } catch (e) {
          return meetingConfigArg.name;
        }
      }
      return (
        "No name"
      );
    })(),
    passWord: meetingConfigArg.pwd,
    leaveUrl: "/index.html",
    role: parseInt(meetingConfigArg.role, 10),
    userEmail: (function () {
      try {
        return testTool.b64DecodeUnicode(meetingConfigArg.email);
      } catch (e) {
        return meetingConfigArg.email;
      }
    })(),
    lang: meetingConfigArg.lang,
    signature: meetingConfigArg.signature || "",
    china: meetingConfigArg.china === "1",
  };

}



function beginJoin(signature) {
  console.log("######")
  console.log(meetingConfig)
  console.log("#######")
  ZoomMtg.init({
    leaveUrl: meetingConfig.leaveUrl,
    webEndpoint: meetingConfig.webEndpoint,
    webEndpoint: meetingConfig.webEndpoint,
    disableCORP: !window.crossOriginIsolated, // default true
    // disablePreview: false, // default false
    success: function () {
      // console.log(meetingConfig);
      // console.log("signature", signature);
      // ZoomMtg.i18n.load(meetingConfig.lang);
      // ZoomMtg.i18n.reload(meetingConfig.lang);
      ZoomMtg.join({
        meetingNumber: meetingConfig.mn,
        userName: meetingConfig.userName,
        signature: signature,
        apiKey: meetingConfig.apiKey,
        userEmail: meetingConfig.userEmail,
        passWord: meetingConfig.pwd,
        success: function (res) {
          console.log("join meeting success");
          console.log("get attendeelist");
          ZoomMtg.getAttendeeslist({});
          ZoomMtg.getCurrentUser({
            success: function (res) {
              console.log("success getCurrentUser", res.result.currentUser);
            },
          });
        },
        error: function (res) {
          console.log("zoom join" + res);
        },
      });
    },
    error: function (res) {
      console.log("zoom init" + res);
    },
  });

  ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
    console.log('inMeetingServiceListener onUserJoin', data);
  });

  ZoomMtg.inMeetingServiceListener('onUserLeave', function (data) {
    console.log('inMeetingServiceListener onUserLeave', data);
  });

  ZoomMtg.inMeetingServiceListener('onUserIsInWaitingRoom', function (data) {
    console.log('inMeetingServiceListener onUserIsInWaitingRoom', data);
  });

  ZoomMtg.inMeetingServiceListener('onMeetingStatus', function (data) {
    console.log('inMeetingServiceListener onMeetingStatus', data);
  });
  
}


