import React from "react";
import { useField } from "formik";
import Checkbox from "@material-ui/core/Checkbox";

function CheckboxField(props) {
    const { name, ...rest } = props;
    const [field] = useField({ name, type: name });
    return <Checkbox {...field} {...rest} />;
}

export default CheckboxField;
