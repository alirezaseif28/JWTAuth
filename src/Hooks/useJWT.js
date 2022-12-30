import React from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:4000/api/";

function useJWT() {
  const refreshToken = () => {
    const token = localStorage.getItem("refresh");
    return axios
      .post(API_URL + "token", {
        token,
      })
      .then((response) => {
        if (response.data.access) {
          localStorage.setItem("access", response.data.access);
        }
        if (response.data.refresh) {
          localStorage.setItem("refresh", response.data.refresh);
        }
        return response.data;
      });
  };

  function login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.access) {
          localStorage.setItem("access", response.data.access);
        }
        if (response.data.refresh) {
          localStorage.setItem("refresh", response.data.refresh);
        }
        return response.data;
      });
  }

  axios.interceptors.request.use(
    (request) => {
      request.headers.common["Accept"] = "application/json";
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status) {
        switch (error.response.status) {
          case 401:
            return new Promise((resolve, reject) => {
              refreshToken().then((responseTwo) => {
                resolve(
                  sendPostRequest(
                    error.response.config.url
                      .split("/")
                      .findLast((item) => true)
                      .toString(),
                    error.response.config.data
                  )
                );
              });
            });

          case 500:
            // Actions for Error 500
            Promise.reject(error);
            break;
          default:
            Promise.reject(error);
            break;
        }
      } else {
        // Occurs for axios error.message = 'Network Error'
        Promise.reject(error);
      }
      // const originalRequest = error.config;

      // // Remove token and redirect
      // if (error.response.status === 400 || error.response.status === 403) {
      //   // localStorage.removeItem(AUTH_TOKEN);
      //   // history.push(ENTRY_ROUTE);
      //   // window.location.reload();
      // }

      // if (error.response.status != 401) return Promise.reject(error);

      // // Unauthorized error token should refresh with access token

      // // exp date in token is expressed in seconds, while now() returns milliseconds:

      // try {
      //   const res = await refreshToken();
      //   axios
      //     .request(originalRequest)
      //     .then((response) => {
      //       Promise.resolve(response);
      //     })
      //     .catch((err) => {
      //       Promise.reject(err);
      //     });
      //   //return service(originalRequest);
      // } catch (error) {
      //   Promise.reject(error);
      // }
    }
  );
  const sendPostRequest = (url, data) => {
    const token = localStorage.getItem("access");
    axios.defaults.headers.common["jwt"] = token;

    return axios.post(API_URL + url, {
      data,
    });
  };

  const logout = () => {
    const token = localStorage.getItem("refresh");
    return axios
      .delete(API_URL + "logout", {
        token,
      })
      .then((response) => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      });
  };

  return {
    login,
    logout,
    refreshToken,
    sendPostRequest,
  };
}

export default useJWT;
