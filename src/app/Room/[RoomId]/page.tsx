'use client'
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function randomID(len: number) {
  let result = '';
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function App({params}:{params:{RoomId:string}}) {

const roomID=params.RoomId
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const setupMeeting = async () => {
      if (!containerRef.current) return;
     
      const appID = 768984339;
      const serverSecret = "1027ff9a089fa8fe61d562e081864aa6";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));

      // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // start the call
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
              window.location.protocol + '//' +
              window.location.host + window.location.pathname +
              '?roomID=' +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
        turnOnMicrophoneWhenJoining: true, // Enable audio
        turnOnCameraWhenJoining: false, // Disable camera
        showMyCameraToggleButton: true, // Custom option to hide camera button (hypothetical)
        showScreenSharingButton: false, // Custom option to hide screen sharing button (hypothetical)
      });
    };

    setupMeeting();
  }, [roomID]);

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
></div>
);
}