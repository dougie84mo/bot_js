import {Card} from "react-bootstrap";
import React from "react";
import {Button, Col, Row} from "react-bootstrap";
import Page from "./Page";
import GroupPage from "./GroupPage";
import PageHeader from "./PageHeader";

export default function Profiles() {
    //Get user related dash cards or


    return (
        <Row>
            <Col className="col_taupe" lg={3}>
                <Button variant="info" size="lg">Create profile group</Button>
                <hr/>
                <div className="overflow-auto">
                    {
                        
                    }
                </div>
            </Col>
            <Col lg={9}>
                <PageHeader title="Monitors"/>
            </Col>
        </Row>
    )
}