import React from "react"
import "./components/_global.scss"
import {Col, Container, Nav, Row, Tab} from "react-bootstrap";
import {command_task_list} from "../lib/command";
// import { Pro } from "../tech_boy";
import Dash from "./pages/Dash";
import Monitors from "./pages/Monitors";


const App = () => {

    const pages = {
        dash: <Dash/>,
        monitors: <Monitors/>,
    }

    const tab_pane = (key, page, active=false) => (
        <Tab.Pane eventKey={key}>
            <div className="nav d-block">
                {page}
            </div>
        </Tab.Pane>
    )

    const nav_link = (key, active=false) => (
        <Nav.Item>
            <Nav.Link eventKey={key.toLowerCase()}>{key}</Nav.Link>
        </Nav.Item>
    )

    return (
        <Container fluid id="global-body-container">
            <Tab.Container id="global-tab-container" defaultActiveKey="monitors">
              <Row>
                <Col sm={2}>
                  <Nav fill variant="pills" className="flex-column">
                      {
                          command_task_list.map((item, id) => {
                              console.log(id);
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