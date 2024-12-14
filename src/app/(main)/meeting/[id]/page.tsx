"use client";

import AgoraUIKit from "agora-react-uikit";
import { useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
// import { Tooltip

import { useGetMeetingById } from "@/api/meeting";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function MeetingDetailPage() {
  const { id } = useParams(); // Get the meeting ID directly from the URL
  const { meeting, isPendingMeeting } = useGetMeetingById(id as string);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const handleShareToSocialMedia = async () => {
    const referralLink = window.location.href; // Get the current page URL as the referral link

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Invite Your Friends",
          text: "Join me and earn bonuses!",
          url: referralLink, // Use the current page URL as the referral link
        });
        console.log("Share successful");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };
  useEffect(() => {
    if (!meeting) {
      // Handle case when meeting not found
      console.log("Meeting not found");
    }
  }, [meeting]);

  const handleStartCall = () => {
    setIsCallStarted(true);
  };

  if (isPendingMeeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`${
        isCallStarted
          ? "p-0"
          : "p-6 min-h-screen bg-gradient-to-b from-secondary/30 to-background"
      }`}
    >
      {!isCallStarted ? (
        <div className="max-w-7xl mx-auto">
          <div className="bg-card p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{meeting?.title}</h2>
                <p className="text-gray-500 mt-2">{meeting?.description}</p>
                <p className="text-sm mt-4 text-primary font-medium">
                  {new Date(meeting?.date).toLocaleString()}
                </p>
              </div>

              {/* Share button */}
              <button
                onClick={handleShareToSocialMedia}
                className="bg-primary p-2 rounded-full text-white hover:bg-primary/80"
                aria-label="Share this meeting"
              >
                <FaShareAlt size={24} />
              </button>
            </div>
            <div className="p-4 rounded-lg shadow hover:shadow-lg transition-shadow mt-4">
              <Button
                onClick={handleStartCall}
                className="mt-4 w-full bg-primary"
              >
                Start Call
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <AgoraUIVideoPlayer
          token={meeting?.token}
          channel={meeting?.title}
          setJoined={setIsCallStarted}
          setLoading={() => {}}
        />
      )}
    </div>
  );
}

function AgoraUIVideoPlayer({ token, channel, setJoined, setLoading }: any) {
  const currentActiveUserId = localStorage.getItem("currentActiveUserId") || "";
  const random = (Math.random() * 16) | 0;

  const agoraAppId =
    process.env.NEXT_PUBLIC_AGORA_APP_ID || "998e1c904157414e9010380f7931bd15";

  const rtcProps = {
    appId: agoraAppId,
    channel: channel,
    token: token,
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
  }, []);

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
