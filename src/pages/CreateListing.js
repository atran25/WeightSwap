import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  addDoc,
  addDoct,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "machine",
    name: "",
    description: "",
    latitude: 0,
    longitude: 0,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    used: true,
    hoursUsed: 0,
    address: "",
    offer: true,
  });

  const {
    type,
    name,
    description,
    latitude,
    longitude,
    regularPrice,
    discountedPrice,
    images,
    used,
    hoursUsed,
    address,
    offer,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const onSubmit = async (event) => {
    event.preventDefault();
    // console.log(formData);

    setLoading(true);

    if (offer && parseInt(discountedPrice) >= parseInt(regularPrice)) {
      setLoading(false);
      toast.error("Discounted price should be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max of 6 images");
      return;
    }

    let geolocation = {};
    let location;

    const response = await fetch(
      `${process.env.REACT_APP_GOOGLE_GEOCODE_URL}?address=${address}&key=${process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY}`
    );

    const data = await response.json();
    console.log(data);

    geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
    geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
    location =
      data.status === "ZERO_RESULTS"
        ? undefined
        : data.results[0]?.formatted_address;

    if (location === undefined || location.includes("undefined")) {
      setLoading(false);
      toast.error("Please enter a correct address");
      return;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is pause");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("One of the images couldn't be uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;

    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    !formDataCopy.used && delete formDataCopy.hoursUsed;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    setLoading(false);
    toast.success("Successfully created listing");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (event) => {
    let boolean = null;
    if (event.target.value === "true") {
      boolean = true;
    }
    if (event.target.value === "false") {
      boolean = false;
    }

    if (event.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: event.target.files,
      }));
    }

    if (!event.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.id]: boolean ?? event.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Machine / Barbell / Weight</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "machine" ? "formButtonActive" : "formButton"}
              id="type"
              value="machine"
              onClick={onMutate}
            >
              Machine
            </button>
            <button
              type="button"
              className={type === "barbell" ? "formButtonActive" : "formButton"}
              id="type"
              value="barbell"
              onClick={onMutate}
            >
              Barbell
            </button>
            <button
              type="button"
              className={type === "weight" ? "formButtonActive" : "formButton"}
              id="type"
              value="weight"
              onClick={onMutate}
            >
              Weight
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="64"
            minLength="5"
            required
          />

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Description</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="description"
            value={description}
            onChange={onMutate}
            required
          />

          <label className="formLabel">New or Used?</label>
          <div className="formButtons">
            <button
              className={used ? "formButton" : "formButtonActive"}
              type="button"
              id="used"
              value={false}
              onClick={onMutate}
            >
              New
            </button>
            <button
              className={used ? "formButtonActive" : "formButton"}
              type="button"
              id="used"
              value={true}
              onClick={onMutate}
            >
              Used
            </button>
          </div>

          {used && (
            <>
              <label className="formLabel">Hours Used</label>
              <input
                className="formInputSmall"
                type="number"
                id="hoursUsed"
                value={hoursUsed}
                onChange={onMutate}
                required
              />
            </>
          )}

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={offer ? "formButton" : "formButtonActive"}
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <input
            className="formInputSmall"
            type="number"
            id="regularPrice"
            value={regularPrice}
            onChange={onMutate}
            min="0"
            max="10000000"
            required
          />

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="0"
                max="10000000"
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be used as the cover (max 6 images).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
