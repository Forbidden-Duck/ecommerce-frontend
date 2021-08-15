import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import {
    getUser,
    updateUser,
    deleteUser,
    clearUserError,
} from "../../store/user/User.actions";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import "./Profile.css";

function Profile() {}

export default Profile;
