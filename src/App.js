import React from "react"
import Header from "./components/Header"
import "./components/_global.scss"
import {Col, Container, Nav, Row, Tab, Button} from "react-bootstrap";
import {forEach} from "react-bootstrap/ElementChildren";
import { command_task_list } from "../lib/command";
// import { Pro } from "../tech_boy";

import Dash from "./pages/Dash";
import Monitors from "./pages/Monitors";


const App = () => {

    const pages = {
        dash: <Dash/>,
        monitor: <Monitors/>,

    }

    const tab_pane = (key, page) => (
        <Tab.Pane eventKey={key}>
            <div className="nav">
                {page}
            </div>
        </Tab.Pane>
    )

    const nav_link = (key) => (
        <Nav.Item>
            <Nav.Link eventKey={key.toLowerCase()}>{key}</Nav.Link>
        </Nav.Item>
    )

    return (
        <Container fluid id="global-body-container">
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={2}>
                  <Nav variant="pills" className="flex-column">
                      {
                          command_task_list.map((item) => {
                              return nav_link(item);
                          })
                      }
                  </Nav>
                </Col>
                <Col sm={10}>
                  <Tab.Content>
                      {
                          command_task_list.map(() => {
                              
                          })
                      }
                      <Tab.Pane eventKey="dash">
                          <div className="nav">
                              <Dash />
                          </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="monitors">
                          <div className="nav">
                              <Monitors />
                          </div>
                      </Tab.Pane>

                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
        </Container>
    )

    // return (
    //         <Row>
    //             <Col sm={2}>
    //                 <Header/>
    //             </Col>
    //             <Col>

    //             </Col>
    //         </Row>
    //     </Container>
    // )
}

export default App;