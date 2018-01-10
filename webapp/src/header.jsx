import React from "react";
import SVGInline from "react-svg-inline";
import LogoSVG from "./logo.svg";

export default class Header extends React.Component {

    render() {
        return (
            <header className="header">
                <div className="section-content">
                    <SVGInline className="logo" svg={LogoSVG}/>
                </div>
            </header>
        )
    }

}