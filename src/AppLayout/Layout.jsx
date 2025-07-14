import React from 'react';
import AppFooter from './Footer';
import Header from './Header/Header';



const Layout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <AppFooter/>
  </>
);

export default Layout;