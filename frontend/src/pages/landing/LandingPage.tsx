import "./landing.scss";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";

export function LandingPage() {
    return (
        <div className="landingPageDiv">
            <TempNavbar />
            <section>
                sessão 1
            </section>
            <section>
                secção 1
            </section>
            <section>
                seção 1
            </section>
            landing
        </div>
    )
}

function TempNavbar() {

    return (
        <div className="tempNavbarDiv">
            <div className="row">
                <div className="navItem">
                    <button className="dropdownButton">
                        MENU DROPDOWN
                    </button>
                </div>
                <div className="navItem">
                    LOGOTIPO
                </div>
                <div className="navItem">
                    LOGIN BUTTON
                </div>
            </div>
            <div className="row dropdown">
                <ul className="dropdownContent">
                    <li>s</li>
                    <li>a</li>
                    <li>s</li>
                </ul>
            </div>
        </div>
    )
}