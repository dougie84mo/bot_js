import React from "react";
import {Col} from "react-bootstrap";
import PropTypes from "prop-types";

const PageHeader = ({title}) => {

    return (
        <Col sm={3}>
            <h2 className="text-white-50">{title}</h2>
        </Col>
    )
}



export default PageHeader;