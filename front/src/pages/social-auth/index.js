import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import "./index.css";

const  BACKEND_API_URL = "http://127.0.0.1:8000"

const SocialAuth = () => {
  let location = useLocation();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("location -------", location)
    const values = queryString.parse(location.search);
    const code = values.code ? values.code : null;
    if (code) {
      onGogglelogin();
    }
  }, []);

  const googleLoginHandler = (code) => {
    return axios
      .get(`${BACKEND_API_URL}/api/auth/google/${code}`)
      .then((res) => {
        console.log("res", res)
        localStorage.setItem("goggleFirstName", res.data.user.first_name);
        navigate('/')
        return res.data;
      })
      .then((data) => {
        console.log("data", data)
        axios.get(`${BACKEND_API_URL}/api/googleUserList/`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`
          }
        })
        .then(res => {
          console.log("response from new endpoint", res)
        })
        .catch(err => {
          console.log("error from new endpoint", err)
        })
      })
      .catch((err) => {
        console.log("error", err)
        return err;
      });
  };

  const onGogglelogin = async () => {
    const response = await googleLoginHandler(location.search);
    // console.log(response);
    // await axios.get(`${BACKEND_API_URL}/api/googleUserList/`)
    // .then(res => {
    //   console.log("response from new endpoint", res)
    // })
  }

  return (
    <div className="loading-icon-container">
      <div className="loading-icon">
        <div className="loading-icon__circle loading-icon__circle--first"></div>
        <div className="loading-icon__circle loading-icon__circle--second"></div>
        <div className="loading-icon__circle loading-icon__circle--third"></div>
        <div className="loading-icon__circle loading-icon__circle--fourth"></div>
      </div>
        <small className=" text-center mr-2">
          Just a moment
        </small>
    </div>
  );
};


export default SocialAuth;
