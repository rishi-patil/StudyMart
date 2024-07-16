import React from "react";
import HighlightText from "../../core/HomePage/HighlightText"
import know_progress from "../../../assets/Images/Know_your_progress.png"
import compare_others from "../../../assets/Images/Compare_with_others.png"
import plan_lessons from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../HomePage/Button"

const LearningLanguageSection = () => {
  return (
    <div className="mt-[40px]">
    <div className="flex flex-col gap-5 items-center">

      <div className="text-4xl font-semibold  text-center ">
        Your Swiss kniife for
        <HighlightText text={" learning any language"} />
      </div>

      <div className="text-center text-richblack-600 mx-auto text-base font-medium w-[70%]">
        Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
      </div>
    
        <div className="flex flex-row items-center justify-center mt-5">

          <img src={know_progress} alt="" className="object-contain -mr-32" />
          <img src={compare_others} alt="" className="object-contain"/>
          <img src={plan_lessons} alt="" className="object-contain  -ml-36"/>
          
        </div>

        <div className="w-fit mb-8">
          <CTAButton active={true} linkto={"/signup"}>
            <div >
              Learn More
            </div>
        </CTAButton>
        </div>

      </div>
    </div>
  )
};

export default LearningLanguageSection;
