"use client"

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { FormEvent, useState } from "react";

export default function(){

    const[url,setUrl] = useState<string>("")

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
       event.preventDefault();
        console.log(url)
    }

    return(
       <form onSubmit = {handleSubmit} className="mb-4">
        <div className = "space-y-4">
            <Input value = {url} onChange = {(e=>{
                setUrl(e.target.value)
            })} className="h-12" type= "url" placeholder="Enter URL to shorten" required />
            <Button children = {"Shorten URL"} className="w-full p-2" type="submit"/>

        </div>
       </form>
    )
}