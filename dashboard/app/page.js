"use client"

import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export default function Dashboard(){

 const [requests,setRequests] = useState([])

 useEffect(()=>{

  const socket = io("http://localhost:4000")

  socket.on("newRequest",(data)=>{

   setRequests(prev => [...prev,data])

  })

 },[])

 return(

  <div>

   <h1>Solicitudes del restaurante</h1>

   {requests.map((r,i)=>(

    <div key={i}>
      Mesa {r.table} pidió {r.type}
    </div>

   ))}

  </div>

 )
}