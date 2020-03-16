import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import { axiosBase } from '../../constants/Endpoint';
import { AsyncStorage } from 'react-native';
import { TOKEN_REFRESH, USER_TOKEN } from '../../constants/storageKey';

export const isTokenExp = (token) => (
    // return true if token was expired
    token && jwt_decode(token).exp < Date.now() / 1000
)

export const isTokenRefreshExp = (refresh) => (
    refresh && jwt_decode(refresh).exp < Date.now() / 1000
)

export const getNewToken = (kwargs) => {
    return new Promise((resolve, reject) => {
        axiosBase.post('token/', kwargs)
        .then((response) => {
            AsyncStorage.multiRemove([
                USER_TOKEN,
                TOKEN_REFRESH
            ], (err) => {
                if (err) {
                    reject(err);
                };
                AsyncStorage.multiSet([
                    [USER_TOKEN, response.data.access],
                    [TOKEN_REFRESH, response.data.refresh]
                ], (err) => {
                    reject(err);
                });
            });
            resolve(response);
        })
        .catch((err) => reject(err));
    });
};

export const refreshToken = (refresh) => {
    return new Promise((resolve, reject) => {
        axiosBase.post('token/refresh/', {
            refresh: refresh
        })
        .then((response) => {
            AsyncStorage.removeItem(USER_TOKEN, (err) => {
                if (err) {
                    reject(err);
                }

                AsyncStorage.setItem([USER_TOKEN, response.data.access], (err) => {
                    if (err) {
                        reject(err)
                    }
                })
            });
            resolve(response);
        })
        .catch(err => reject(err));
    });
};