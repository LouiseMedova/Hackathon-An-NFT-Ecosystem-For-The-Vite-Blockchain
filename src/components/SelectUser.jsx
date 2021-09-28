import React, { useState, useEffect } from 'react';
import TokenService from '../API/TokenService';
import Dropdown from '../UI/MyDropDown/MyDropDown';
import { useFetching } from '../hooks/UseFetching';


const SelectUser = ({login}) => {

    const [users, setUsers] = useState([]);

    const [fetchUsers, isUsersLoading, userError] = useFetching ( async() => {
        const users = await TokenService.getUsers();

        setUsers(users);
      });
      
      useEffect(() => {
        fetchUsers();
      }, [])

    return(
        <div>
            <Dropdown 
                options = {users}
                onChange={selectedAccount => login(selectedAccount)}
             />
        </div>
    )
}

export default SelectUser;