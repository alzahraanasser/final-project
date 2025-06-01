import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./Store/store";  // استيراد الـ store من Redux
import { Provider } from "react-redux";  // استيراد الـ Provider من React-Redux
import { BrowserRouter as Router } from "react-router-dom";  // استيراد الـ Router

const root = ReactDOM.createRoot(document.getElementById("root"));  // تحديد العنصر الذي سيتم تحميل التطبيق فيه
root.render(
  <Provider store={store}>  {/* تمكين Redux عبر Provider */}
    <Router>  {/* إضافة الـ Router هنا */}
      <React.StrictMode>
        <App />  {/* تحميل تطبيق React */}
      </React.StrictMode>
    </Router>
  </Provider>
);
