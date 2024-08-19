import { useParams } from "react-router-dom";
import Footer from "../components/common/Footer"
import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { getCatalogPageDetails } from "../services/pageAndComponentData";
import CourseSlider from '../components/core/Catalog/CourseSlider';

const Catalog = () => {

    const { catalogName } = useParams();
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [catagoryId, setCategoryId] = useState("");

    //Fetch all categories
    useEffect(() => {
        const getCatagories = async () => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);  
           // console.log("Printing ALL Categories:", res);
            const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
          //  console.log("PRinting Category ID:", category_id);
            setCategoryId(category_id); 
        }
        getCatagories();
    }, [catalogName])
    
    useEffect(() => {
        const getCatagoryDetails = async () => {
            try {
                const res = await getCatalogPageDetails(catagoryId);
                //console.log("Printing Res:", res);
                setCatalogPageData(res);
            }
            catch (error) {
                console.log(error);
            }
        }
        getCatagoryDetails();
    }, [catagoryId]);

    return (
        <>
            
      <div className=" box-content bg-richblack-800 px-4">
          <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">{`Home / Catalog `}
                  <span className="text-yellow-25">
                     {catalogPageData?.data?.selectedCategory?.name}
                  </span>
              </p>
              <p className="text-3xl text-richblack-5">{catalogPageData?.data?.selectedCategory?.name}</p>
              <p className="max-w-[870px] text-richblack-200">{catalogPageData?.data?.selectedCategory?.description}</p>
                </div>
            </div>
        <div>
                

              {/* Section1  */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Courses to get you started</div>
                    <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                        <p
                            className={`px-4 py-2 ${active === 1
                                    ? "border-b border-b-yellow-25 text-yellow-25"
                                    : "text-richblack-50"
                                } cursor-pointer`}
                            onClick={() => setActive(1)}
                        >
                            Most Populer
                        </p>
                        <p
                            className={`px-4 py-2 ${active === 2
                                    ? "border-b border-b-yellow-25 text-yellow-25"
                                    : "text-richblack-50"
                                } cursor-pointer`}
                            onClick={() => setActive(2)}
                        >
                            New
                        </p>
                  </div>

                  <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}  />
              </div>

                {/* Section 2 */}
                <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">
                        {catalogPageData?.data?.differentCategories?.length > 0
                            ? `Top courses in ${catalogPageData?.data?.differentCategories[0]?.name}`
                            : "No Courses Available"}
                    </div>
                    <div className="py-8">
                        {catalogPageData?.data?.differentCategories?.length > 0 && (
                            <CourseSlider
                                Courses={catalogPageData?.data?.differentCategories[0]?.courses}
                            />
                        )}
                    </div>
                </div>


             
        <Footer/>
        </div>
    </>
    
  )
};

export default Catalog;
