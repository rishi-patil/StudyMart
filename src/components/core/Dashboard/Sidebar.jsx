import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links"
import { VscSignOut } from "react-icons/vsc"
import { logout } from "../../../services/authAPI"
 import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useState } from "react";

const SideBar = () => {

    const { user, loading: profileLoading } = useSelector((state) => state.profile);
    const { loading: authLoading } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null)  
    
    if (profileLoading || authLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }
    
    return (
      <>
          <div className="flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 h-[cal(100vh-3.5rem)] bg-richblue-800  py-10">
              
              <div className="flex flex-col">
                  {
                      sidebarLinks.map((link, index) => {
                          if (link.type && user?.accountType !== link.type) return null;
                          return (
                              <SidebarLink key={link.id} link={link} iconName={link.icon} />
                          )
                      })
                  }
              </div>

              <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

              <div className="flex flex-col">
                  <SidebarLink link={{ name: "Settings", path: "/dashboard/settings" }} iconName="VscSettingsGear" />

                  <button className="px-8 py-2 text-sm font-medium text-richblack-300"
                      onClick={() =>
                          setConfirmationModal({
                              text1: "Are you sure?",
                              text2: "You will be logged out of your account.",
                              btn1Text: "Logout",
                              btn2Text: "Cancel",
                              btn1Handler: () => dispatch(logout(navigate)),
                              btn2Handler: () => setConfirmationModal(null),
                          })
                      }
                  >
                      <div className="flex items-center gap-x-2">
                          <VscSignOut className="text-lg" />
                          <span>Logout</span>
                      </div>
                  </button>
              </div>
              
          </div>
          
      { confirmationModal && <ConfirmationModal modalData={confirmationModal} /> }
    </>
  )
};

export default SideBar;
