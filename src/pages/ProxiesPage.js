// import {Card} from "react-bootstrap";
import React from "react";
import {Button, Col, Row} from "react-bootstrap";
import Page from "./Page";
import GroupPage from "./GroupPage";
import PageHeader from "./PageHeader";
import {forEach} from "react-bootstrap/ElementChildren";

export default function Monitors() {
    //Get user related dash cards or
    const proxies_groups = {}

    const current_proxy = {}

    const generate_proxies = {}

    return (
        <Row>
            <Col className="col_taupe" sm={3}>
                <Button variant="info" size="lg">Add a Proxy Group</Button>
                <div className="overflow-auto">
                </div>
            </Col>
            <Col sm={9}>
                <PageHeader title="Proxies"/>
            </Col>
        </Row>
    )
}