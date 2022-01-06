import React, { useEffect, useState } from "react";
import calandar from "dayjs/plugin/calendar";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import ListingItem from "./ListingItem";
import dayjs from "dayjs";

const RecentListings = () => {
  const LISTING_LIMIT = 10;
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          orderBy("timestamp", "desc"),
          limit(LISTING_LIMIT)
        );
        const querySnap = await getDocs(q);

        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error(`Unable to fetch recent listings`);
      }
    };
    fetchListings();
  }, []);
  return (
    <div>
      <header>
        <p className="exploreCategoryHeading">Recent Listings</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul>
              {listings.map((listing) => {
                dayjs.extend(calandar);
                const listingDate = listing.data.timestamp.toDate();
                return (
                  <>
                    <p className="exploreCategoryName">
                      {dayjs(listingDate).calendar()}
                    </p>
                    <ListingItem
                      listing={listing.data}
                      id={listing.id}
                      key={listing.id}
                    />
                  </>
                );
              })}
            </ul>
          </main>
        </>
      ) : (
        <p>No Recent listings</p>
      )}
    </div>
  );
};

export default RecentListings;
