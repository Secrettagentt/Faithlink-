"use client";

import AgoraUIKit from "agora-react-uikit";
import { useEffect } from "react";
// import { Tooltip } from "antd";

function AgoraUIVideoPlayer({
  token,
  channelName,
  setJoined,
  setLoading,
  agoraAppId,
}: any) {
  const currentActiveUserId = localStorage.getItem("currentActiveUserId") || "";
  const random = (Math.random() * 16) | 0;

  const rtcProps = {
    appId: "5a5002f3414c4eae81fa2acef8bfa795",
    channel: "Testing",
    token: `007eJxTYLjD/2iSwIxOC9VtgpKhTpe3cpofOzR/f/McDz5nlzfLyuoVGEwTTQ0MjNKMTQxNkk1SE1MtDNMSjRKTU9MsktISzS1Nc3xi0hsCGRm2BM5lZGSAQBCfnSEktbgkMy+dgQEAWDIfyQ==`,
    uid: random,
  };

  const callbacks = {
    EndCall: () => setJoined(false),
    ["connection-state-change"](curState: any, _: any, reason: any): void {
      if (curState === "DISCONNECTED") {
        setJoined(false);
        setLoading(false);
        console.error("Connection error: ", reason);
      }
      if (curState === "CONNECTED") {
        setLoading(false);
        console.info("Connected successfully!");
      }
    },
  };

  const customButton = {
    borderRadius: "50%",
    backgroundColor: "#1F2937",
    border: "2px solid #4F46E5",
    color: "#FFF",
    padding: "10px",
    cursor: "pointer",
    transition: "0.3s ease",
  };

  const styleProps = {
    theme: "#FFFFFF",
    UIKitContainer: { background: "#1F2937" },
    localControlStyles: {
      bottom: 0,
      height: "80px",
      backgroundColor: "#1F2937",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px",
    },
    btnStyles: customButton,
    localBtnStyles: {
      muteLocalAudio: customButton,
      muteLocalVideo: customButton,
      switchCamera: customButton,
      endCall: {
        ...customButton,
        backgroundColor: "#EF4444",
        border: "2px solid #B91C1C",
      },
    },
  };

  useEffect(() => {
    // Handle any additional setup or cleanup
    // return () => {
    //   setJoined(false); // Reset the joined state when component unmounts
    // };
  }, [setJoined]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#111827",
          color: "#FFF",
          padding: "10px 20px",
          height: "60px",
        }}
      >
        <h3 style={{ margin: 0 }}>Faith Connect Calls</h3>
        <div>
          <span>User: {currentActiveUserId || "Guest"}</span>
        </div>
      </div>

      <div className="flex w-full h-[calc(100dvh-60px)]">
        <AgoraUIKit
          rtcProps={rtcProps}
          callbacks={callbacks}
          styleProps={styleProps}
        />
      </div>
    </div>
  );
}

export default AgoraUIVideoPlayer;
