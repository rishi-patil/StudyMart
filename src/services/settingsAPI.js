import { toast } from "react-hot-toast";
import { apiConnector } from "./apiconnector";
import { settingsEndpoints } from "./apis";
import { logout } from "./authAPI"
import { setUser } from "../slice/profileSlice";

const { DELETE_PROFILE_API, UPDATE_PROFILE_API } = settingsEndpoints;

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorisation: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      } 
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE PROFILE API RESPONCE..", response);
       if (!response.data.success) {
        throw new Error(response.data.message)
      }
      dispatch(
        setUser({ ...response.data.updatedUserDetails })
      )
      toast.success("Profile Updated Successfully")
    }
    catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR...", error);
      toast.error("Not able to Update Profile");
    }
      toast.dismiss(toastId);
  }
} 