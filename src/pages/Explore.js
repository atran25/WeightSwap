import React from "react";
import { Link } from "react-router-dom";
import weightCategoryImage from "../assets/img/weightCategoryImage.jpg";
import machineCategoryImage from "../assets/img/machineCategoryImage.jpg";
import barbellCategoryImage from "../assets/img/barbellCategoryImage.png";
import RecentListings from "../components/RecentListings";

const Explore = () => {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/weight">
            <img
              src={weightCategoryImage}
              alt="weights"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Weights</p>
          </Link>
          <Link to="/category/machine">
            <img
              src={machineCategoryImage}
              alt="machines"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Machines</p>
          </Link>
          <Link to="/category/barbell">
            <img
              src={barbellCategoryImage}
              alt="barbells"
              className="exploreCategoryImg"
            />
            <p classame="exploreCategoryName">Barbells</p>
          </Link>
        </div>
        <RecentListings />
      </main>
    </div>
  );
};

export default Explore;
