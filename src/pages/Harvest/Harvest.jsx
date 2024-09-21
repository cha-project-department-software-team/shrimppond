import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import useCallApi from '../../hooks/useCallApi';
import React, { useState, useCallback, useEffect } from 'react';
import { EvistaRequestApi } from '../../services/api';


function Harvest (){

    const navigate = useNavigate()
    const callApi = useCallApi();

    const [isCreateModal, setIsCreateModal] = useState(false)
    const B01 = "B01"

    const fetchData = useCallback(
      () => {
        callApi(
          () => EvistaRequestApi.TemperatureRequest.getTempRequest(B01, "Temperature"), 
          (res) => {
            console.log(res)
          },
          "Lấy danh sách khối ao thất bại!"
        );
      }, [callApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    
    return (
        <div className ="flex">
            <aside>
                <Sidebar />
            </aside>

          
        </div>   
    )
}

export default Harvest