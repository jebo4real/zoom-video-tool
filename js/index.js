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

var params = window.location.search
const urlParams = new URLSearchParams(params)

testTool.setCookie(
  "display_name",
  display_name
)
testTool.setCookie(
  "meeting_lang",
  meeting_lang
)
testTool.setCookie("meeting_pwd", meeting_pwd)
testTool.setCookie(
  "meeting_number",
   meeting_number
)


document.addEventListener("DOMContentLoaded", function(event) {
  // e.preventDefault();
  const meetingConfig = testTool.getMeetingConfig()
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



  if (!meetingConfig.mn || !meetingConfig.name) {
    alert("Meeting number or username is empty");
    return false;
  }
  testTool.setCookie("meeting_number", meetingConfig.mn);
  testTool.setCookie("meeting_pwd", meetingConfig.pwd);
  testTool.setCookie("meeting_role", meetingConfig.role);

  const signature = ZoomMtg.generateSignature({
    meetingNumber: meetingConfig.mn,
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    role: meetingConfig.role,
    success: function (res) {
      console.log(res.result);
      meetingConfig.signature = res.result;
      meetingConfig.apiKey = API_KEY;
      const joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
      console.log(joinUrl);
      window.location = joinUrl
    },
  });

});

// click copy jon link button
window.copyJoinLink = function (element) {
  const meetingConfig = testTool.getMeetingConfig();
  if (!meetingConfig.mn || !meetingConfig.name) {
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
      const joinUrl =
        testTool.getCurrentDomain() +
        "/meeting.html?" +
        testTool.serialize(meetingConfig);
      document.getElementById('copy_link_value').setAttribute('link', joinUrl);
      copyToClipboard('copy_link_value');
    },
  });
};

