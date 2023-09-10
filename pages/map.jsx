"use client";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { faBars, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FilterDrawer from "../components/FilterDrawer";
import LocationMap from "../components/LocationMap";
import { DB_CONFIG_OPTIONS, SERVER_OPTIONS } from "../constants";

function Map() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  // Function to toggle filter menu visibility
  const toggleFilterMenu = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    if (!isLoading) {
      const userId = user.name;
      const axiosInstance = axios.create({
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      const params = new URLSearchParams([["userId", userId]]);
      axiosInstance
        .request({
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_ENDPOINT}/user-exists`,
          params: params,
        })
        .then((response) => {
          console.log(response);
          if (response.data.exists === false) {
            router.push("/auth-with-notion");
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [user, isLoading]);

  useEffect(() => {
    // Fetch filter options from the API endpoint
    axios
      .request(DB_CONFIG_OPTIONS(user.name))
      .then((response) => {
        setFilterOptions(response.data);
        setSelectedFilters(
          Object.fromEntries(Object.keys(response.data).map((key) => [key, []]))
        );
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      });
  }, []);

  return (
    !isLoading && (
      <div className="map-container">
        <div className="map-overlay">
          <button className="hamburger-button" onClick={toggleFilterMenu}>
            <FontAwesomeIcon icon={faBars} /> {/* Hamburger icon */}
          </button>
          <button
            className="reload-button"
            onClick={() => {
              axios
                .request(SERVER_OPTIONS)
                .then(function async(response) {
                  location.reload();
                  console.log(response);
                })
                .catch(function (error) {
                  console.error(error);
                });
            }}
          >
            <FontAwesomeIcon icon={faRefresh} />
          </button>
          {showFilters && (
            <div className={`filter-drawer ${showFilters ? "show" : ""}`}>
              {/* Close button for the filter menu */}
              <button className="close-button" onClick={toggleFilterMenu}>
                &times; {/* Unicode "times" symbol (close icon) */}
              </button>

              {/* FilterDrawer component */}
              <FilterDrawer
                filters={filterOptions}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            </div>
          )}
        </div>
        <LocationMap
          filters={filterOptions}
          selectedFilters={selectedFilters}
          userId={user.name}
        />
      </div>
    )
  );
}

export default withPageAuthRequired(Map);
