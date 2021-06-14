import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import PageHeader from "./PageHeader";

const GroupPage = ({title, body, titleContent}) => {
    let titleButtons
    if (titleContent !== undefined && titleContent !== null) {
        titleButtons = () => (
            <Col sm={9}>
                {titleContent}
            </Col>
        )
    } else {
        titleButtons = null
    }

    return (
        <>
            <Col sm={3}>
                <Button variant="info" size="lg">Add a monitor group</Button>{' '}
            </Col>
            <Col sm={9}>
                <PageHeader title={title}/>
            </Col>
        </>
    )
}



export default GroupPage;