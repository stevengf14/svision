import React from "react";
import { CONTACT_TITLE } from "utils/Constants";

const Footer = () => {
  return (
    <footer className="footer has-background-dark has-text-white ">
      <div className="content has-text-centered">
        <p>
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <p>
          <a href="/contact" className="has-text-white">{CONTACT_TITLE}</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;