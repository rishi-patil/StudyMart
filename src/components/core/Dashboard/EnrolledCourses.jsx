import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUserEnrolledCourses } from "../../../services/profileAPI";

const EnrolledCourses = () => {

    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate()

    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        }
        catch (error) {
            console.log("Unable to fetch the data");
        }
    }

    useEffect(() => {
        getEnrolledCourses();
    }, [])

    return (
        <div>
            <div className="text-3xl text-richblack-50">Enrolled Courses</div>
            {!enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className="spinner"></div>
                </div>
            ) : !enrolledCourses.length ? (
                <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
                    You have not enrolled in any course yet.
                </p>
            ) : (
                <div className="my-8 text-richblack-5">
                    <div className="flex rounded-t-lg bg-richblack-500 ">
                        <p className="w-[50%] px-5 py-3">Course Name</p>
                    </div>

                    {/* Cards */}
                    {enrolledCourses.map((course, index) => (
                        <div key={course._id} className="flex items-center justify-between border-b border-richblack-700 p-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={course.thumbnail}
                                    alt="course_img"
                                    className="h-14 w-14 rounded-lg object-cover"
                                />
                                <div className="flex max-w-xs flex-col gap-2">
                                    <p className="font-semibold">{course.courseName}</p>
                                    <p className="text-xs text-richblack-300">
                                        {course.courseDescription.length > 50
                                            ? `${course.courseDescription.slice(0, 50)}...`
                                            : course.courseDescription}
                                    </p>
                                </div>
                            </div>

                           
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrolledCourses;
