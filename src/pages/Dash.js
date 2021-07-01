import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import Page from "./Page";

class Dash extends React.Component {

    render() {
        const dash_boards = {
            amazon_monitor: ''
        }

        const dashes = () => (
            <Row xs={1} md={2} className="g-4">
                {
                    Array.from({ length: 4 }).map((_, idx) => (
                    <Col key={idx+"card_dash_col"}>
                        <Card key={idx+"card_dash"}>
                            <Card.Img variant="top" src="holder.js/100px160" />
                            <Card.Body>
                                <Card.Title>Card {idx}</Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    ))
                }
            </Row>
        )

        return (
            <Page title="Dash" titleContent="" body={dashes()} />
        )
    }

};



export default Dash;