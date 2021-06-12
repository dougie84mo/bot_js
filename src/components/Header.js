import {Nav, Navbar} from "react-bootstrap";
import React from "react";
import {forEach} from "react-bootstrap/ElementChildren";

const Header = () => {
    // const navbaritem = ({active, href}) => (
    //     <Nav.Item>
    //         <Nav.Link active={true} href={"/"+Pro.space_to_underscore(href.toLowerCase())}>{href}</Nav.Link>
    //     </Nav.Item>
    // )
    const navbar = (
        <Nav variant="pills" className="flex-column" defaultActiveKey="dash">
            {}
        </Nav>
    )
    return (
        <Nav variant="pills" className="flex-column" defaultActiveKey="dash">
            <Nav.Item>
                <Nav.Link href="/dash">Dash</Nav.Link>
                <Nav.Link eventKey="nav_proxies">Proxies</Nav.Link>
                <Nav.Link eventKey="nav_monitors">Monitor</Nav.Link>
                <Nav.Link eventKey="nav_tasks">Tasks</Nav.Link>
                <Nav.Link eventKey="nav_gather_products">Gather Products</Nav.Link>
                <Nav.Link eventKey="nav_checkout">Checkouts</Nav.Link>
                <Nav.Link eventKey="nav_raffles">Raffles</Nav.Link>
                <Nav.Link eventKey="nav_harvest">Harvest</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}
export default Header