/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminLayout from "layouts/Admin.js";
import { BirdsContextProvider } from "context/BirdsContext";
import { FeederContextProvider } from "context/FeederContext";
import { VisitContextProvider } from "context/VisitContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BirdsContextProvider>
    <FeederContextProvider>
        <VisitContextProvider>
          <BrowserRouter>
          <Switch>
            <Route path="/main" render={(props) => <AdminLayout {...props} />} />
            <Redirect from="/" to="/main/hierarchy" />
          </Switch>
          </BrowserRouter>
        </VisitContextProvider>
      </FeederContextProvider>
  </BirdsContextProvider>
);
