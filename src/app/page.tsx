"use client"
import { useEffect, useState } from "react";
import {socket} from "@/utils/socket"

export default function Home() {

  useEffect(() => {    
    socket.connect();

    socket.emit("join", 123)


    socket.on("message", (message) => {
      console.log("RECIEVED FROM SOCKET", message)
    })

    return () => {
      socket.emit("leave", 123)

      socket.disconnect()
    }


  }, [])

  return (
    <>   hello</>     
  );
}
