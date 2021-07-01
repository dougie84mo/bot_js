import React from "react"
import "./components/_global.scss"
import {Button, Card, Col, Container, Form, Nav, Row, Tab} from "react-bootstrap";
import {command_task_list} from "../lib/command";
// import { Pro } from "../tech_boy";
import Dash from "./pages/Dash";
import Monitors from "./pages/Monitors";
import ProxiesPage from "./pages/ProxiesPage";
import axios from "axios";
// import LoginApp from "./pages/LoginApp";




const App = () => {
    // Get user object, check to see if user is logged in?
    let VIEW ;
    // console.log(process.env);
    let loggedIn = true;
    let options = {
        method: 'post',
        url: process.env.REACT_APP_TEST_URL+'currentUser'
    }
    axios
        .get(`${process.env.REACT_APP_TEST_URL}currentUser`)
        .then((res) => {
            loggedIn = res.data;
        }, (err) => {
            console.log(err);
        });


    if (loggedIn) {
        const pages = {
            dash: <Dash/>,
            monitors: <Monitors/>,
            proxies: <ProxiesPage/>,
        }

        const tab_pane = (key, page, active=false) => (
            <Tab.Pane key={key+"tabhome_pane"} eventKey={key}>
                <div className="nav d-block">
                    {page}
                </div>
            </Tab.Pane>
        )

        const nav_link = (key, active=false) => (
            <Nav.Item key={key+"tabhome_item"}>
                <Nav.Link key={key+"tabhome_list"} eventKey={key.toLowerCase()}>{key}</Nav.Link>
            </Nav.Item>
        )

        VIEW = (
            <Tab.Container id="global-tab-container" defaultActiveKey="monitors">
                <Row>
                    <Col sm={2}>
                        <Nav fill variant="pills" className="flex-column">
                            {
                                command_task_list.map((item, id) => {
                                    // console.log(id);
                                    return nav_link(item);
                                })
                            }
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            {
                                command_task_list.map((key) => {
                                    return tab_pane(key, pages[key])
                                })
                            }
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        )
    } else {
        VIEW = (
            <div className="align-self-md-auto">
                <Card>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card>
            </div>
        )
    }


    return (
        <Container fluid id="global-body-container">
            {VIEW}
        </Container>
    )

}

export default App;