import { useState } from "react";
import Search from "./search";
import UsersList from "./userslist";

function Sidebar({socket, onlineUsers}) {
    const [searchKey, setSearchKey] = useState('');

    return (
        <div className='app-sidebar'>
            <Search searchKey={searchKey} setSearchKey={setSearchKey} />
            <UsersList 
            searchKey={searchKey} 
            socket={socket} 
            onlineUsers={onlineUsers}
            /> {/* Pass searchKey to UsersList */}
       
        </div>
    );
}
export default Sidebar;