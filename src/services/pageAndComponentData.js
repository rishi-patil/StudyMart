import toast from "react-hot-toast";
import { apiConnector } from "./apiconnector";
import { catalogData } from "./apis";


export const getCatalogPageDetails = async (categoryId) => {
    const toastId =  toast.loading("Loading...")
    let result = [];
    try {
        const responce = await apiConnector(
          "POST",catalogData.CATALOGPAGEDATA_API,
          { categoryId: categoryId }
        );
        
        if (!responce?.data?.success)
            throw new Error("Could not Fetch Category page data")
    
        result = responce?.data;
         //console.log("CATALOG PAGE DATA ...", result);
    }
    catch (error) {
        console.log("CATALOG PAGE DATA API ERROR...", error);
        //toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
};


