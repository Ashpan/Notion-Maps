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
  const [authNotion, setAuthNotion] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    type: [],
    cuisine: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    cuisine: [],
  });

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
        const { cuisine, type } = response.data;
        setFilterOptions({
          type: type,
          cuisine: cuisine,
        });
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      });
  }, []);

  console.log("user", user);

  return (
    !isLoading && (
      <div className="map-container">
        <div className="map-overlay">
          <button
            className="hamburger-button"
            onClick={() => setShowFilters(!showFilters)}
          >
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
            <FilterDrawer
              filters={filterOptions}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          )}
        </div>
        <LocationMap selectedFilters={selectedFilters} userId={user.name} />
      </div>
    )
  );
}

export default withPageAuthRequired(Map);
