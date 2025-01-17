"use client"

import React, { useState } from "react";
import ShortenForm from "./shortenForm";
import UrlList from "./urlList";

export default function UrlContainer(){

    const [refresh , setRefresh] = useState<number>(0);
    
    const handleUrl = ()=>{
        setRefresh((prev)=> prev + 1) 
    }
 
    return(
        <div>
            <ShortenForm handleUrl = {handleUrl}></ShortenForm>
            <UrlList key = {refresh}></UrlList>
        </div>
    )
}