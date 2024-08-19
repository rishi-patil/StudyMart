import DeleteAccount from "./DeleteAccount"
import  EditProfile  from "./EditProfile";

const Settings = () => {
  return (
     <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Profile
          </h1>
          <EditProfile/>
      {/* Delete Account */}
      <DeleteAccount />
    </>
  )
};

export default Settings;
