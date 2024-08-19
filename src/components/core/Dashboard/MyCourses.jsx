import React from 'react';
import { useSelector } from "react-redux"
import { fetchInstructorCourses } from "../../../services/courseDetailsAPI"
import { useEffect, useState } from "react";
import CoursesTable from "./InstructorCoursesTable/CoursesTable"

export default function MyCourses() {
    const { token } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const result = await fetchInstructorCourses(token);
            if(result) {
                setCourses(result);
            }
        }
        fetchCourses();
    }, [token]);

  return (
      <div>
          <div className="mb-14 flex items-center justify-between">
              <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
          </div>
          {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
      </div>
  )
};
