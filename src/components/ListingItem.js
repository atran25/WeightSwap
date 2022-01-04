import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";

const ListingItem = ({ listing, id, onDelete }) => {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imgUrls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingPrice">
            {listing.offer ? <strike>${listing.regularPrice}</strike> : <></>}
            &nbsp; $
            {listing.offer ? listing.discountedPrice : listing.regularPrice}
          </p>
          <div className="categoryListingInfoDiv">
            <p className="categoryListingInfoText">
              {listing.used ? `Used` : ""}
            </p>
            <p className="categoryListingInfoText">
              {listing.used ? `${listing.hoursUsed}+ hours of use` : ""}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231, 76, 60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
    </li>
  );
};

export default ListingItem;
