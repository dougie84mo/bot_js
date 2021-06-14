import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";

const Page = ({title, body, titleContent}) => {
    let titleButtons
    if (titleContent !== undefined && titleContent !== null) {
        titleButtons = () => (
            <Col sm={6}>
                {titleContent}
            </Col>
        )
    } else {
        titleButtons = null
    }

    return (
        <>
            <Row>
                <Col sm={6}>
                    <h2 className="text-white-50">{title}</h2>
                </Col>
                {titleButtons === null ? '' : titleButtons}
            </Row>
            {body}
        </>
    )
}

Page.defaultProps = {
    title: "Dashboard"
}

Page.propTypes = {
    title: PropTypes.string.isRequired,
    titleContent: PropTypes.string
}



export default Page;