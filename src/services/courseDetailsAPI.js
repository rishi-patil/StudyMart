import { courseEndpoints } from "./apis";
import { apiConnector } from "./apiconnector";
import { toast } from "react-hot-toast";

const {
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
} = courseEndpoints;

export const fetchInstructorCourses = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET",GET_ALL_INSTRUCTOR_COURSES_API,null,{
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("INSTRUCTOR COURSES API RESPONSE......", response);
      
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR...", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
    return result;
};

export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    toast.success("Course Deleted");
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
};


export const fetchCourseDetails = async (courseId,token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {

      const response = await apiConnector(
        "GET",
        GET_FULL_COURSE_DETAILS_AUTHENTICATED,
        null, // No body data for GET requests
        {
          Authorization: `Bearer ${token}`,
        },
        { courseId } // Pass the courseId as a query parameter
      );
      
    console.log("FETCH COURSE DETAILS COURSE API RESPONSEe....", response);
     if (response?.data?.success) {
       result = response.data.data; // Assuming 'data' contains the course details
     } else {
       throw new Error("Failed to fetch course details");
    }
    
  } catch (error) {
    console.log("FETCH COURSE DETAILS COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
}
