import { useState } from "react";
import Search from "./search";
import UsersList from "./userslist";
function Sidebar() {
    const [searchKey, setSearchKey] = useState('');

    return (
        <div className='app-sidebar'>
            <Search searchKey={searchKey} setSearchKey={setSearchKey} />
            <UsersList searchKey={searchKey} /> {/* Pass searchKey to UsersList */}
        </div>
    );
}
export default Sidebar;