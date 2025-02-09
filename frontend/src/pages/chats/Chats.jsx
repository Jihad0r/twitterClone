import React from 'react'
import { TiMessages } from "react-icons/ti";

export const Chats = ({authUser} ) => {
	return (
    <div className="flex-[4_4_0] border-r border-gray-700">
        <div className="flex flex-col sm:h-[650px] md:h-[650px] rounded-lg overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-lg">          
            <div className="flex items-center justify-center w-full h-full">
                <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
                    <p>Welcome 👋 {authUser.fullname} ❄</p>
                    <p>Select a chat to start messaging</p>
                    <TiMessages className="text-3xl md:text-6xl text-center" />
					</div>
		</div>
			</div>
		</div>
  )
}
