"use client"
import React, { useEffect, useState } from "react";
import {socket} from "@/utils/socket"

export default function Home() {

  useEffect(() => {    
    socket.connect();
    //emit on a join event "123"
    socket.emit("join", 123)

    //on a message event, console log the message
    socket.on("message", (message: string) => {
      console.log("RECIEVED FROM SOCKET", message)
    })

    //This is an effect clean up function
    //It prevents memory leaks since this function will call this function before calling the effect again
    //In this case, it prevents joining the same room multiple times or multiple rooms
    return () => {
      socket.emit("leave", 123)

      socket.disconnect()
    }


  }, [])
  return (
<>   hello</>     
  );
}
 