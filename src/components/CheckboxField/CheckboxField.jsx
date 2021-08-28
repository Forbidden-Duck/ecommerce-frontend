import React from "react";
import { useField } from "formik";
import Checkbox from "@material-ui/core/Checkbox";

function CheckboxField(props) {
    const { name, ...rest } = props;
    const [field, { error }] = useField({ name, type: name });
    return <Checkbox {...field} {...rest} error={!!error} helperText={error} />;
}

export default CheckboxField;
