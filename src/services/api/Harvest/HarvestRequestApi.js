import axiosClient from "./axiosClient"

const HarvestRequest = {
    HarvestRequestApi: {
        getHarvestTime: async (data) => await axiosClient.get(`/Pond/GetHarvestTime?pondId=${data}`)
    }
}


export default HarvestRequest;