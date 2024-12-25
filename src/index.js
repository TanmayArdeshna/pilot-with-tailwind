import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import Login from "views/examples/Login";
import Register from "views/examples/Register";
import Topics from "views/examples/Topics";
import TopicPage from "views/examples/Topicpage";
import ContinuePage from "views/examples/Continuepage";
import PreviewPage from "views/examples/PreviewPage";
// import Home from "components/Home/Home";
import Landingpage from "components/Home/landingpage";
import PrivateRoute from "views/examples/PrivateRoute";
import Save from "views/examples/Save";
import { Navigate } from "react-router-dom";

// Define the routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/admin/*",
    element: <PrivateRoute><AdminLayout /></PrivateRoute>,  // Protected route wrapped with PrivateRoute
    children: [
      { path: "topics", element: <Topics /> },
      { path: "chapter/:chapterName/:chapterId", element: <TopicPage /> },
      { path: "chapter/:chapterName/:chapterId/resume/:pausedExamId", element: <ContinuePage /> },
      { path: "preview/:userId/:examId", element: <PreviewPage /> },
      { path: "save", element: <Save /> },
      { path: "*", element: <Navigate to="/admin/index" replace /> },
    ],
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Landingpage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,  // Fallback route
  },
]);

// Rendering the app using RouterProvider to apply the defined routes
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RouterProvider router={router} />  // Provide the router to the app

//   import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// import "assets/plugins/nucleo/css/nucleo.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "assets/scss/argon-dashboard-react.scss";

// import AdminLayout from "layouts/Admin.js";
// import Login from "views/examples/Login";
// import Register from "views/examples/Register";
// import Topics from "views/examples/Topics";
// import TopicPage from "views/examples/Topicpage";
// import ContinuePage from "views/examples/Continuepage";
// import PreviewPage from "views/examples/PreviewPage";
// // import Home from "components/Home/Home";
// import Landingpage from "components/Home/landingpage";
// import PrivateRoute from "views/examples/PrivateRoute";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <BrowserRouter>
//     <Routes>
//       {/* Admin routes */}
//       <Route path="/admin/*" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
//         <Route path="topics" element={<Topics />} />
//         {/* Existing route for TopicPage based on chapterName and chapterId */}
//         <Route path="chapter/:chapterName/:chapterId" element={<TopicPage />} />
//         {/* New routes that includes pausedExamId for continuing a paused exam */}
//         <Route path="chapter/:chapterName/:chapterId/resume/:pausedExamId" element={<ContinuePage />} />
//         <Route path="preview/:userId/:examId" element={<PreviewPage />} />
//         <Route path="*" element={<Navigate to="/admin/index" replace />} />
//       </Route>

//       {/* Direct Auth routes */}
//       <Route path="/auth/login" element={<Login />} />
//       <Route path="/auth/register" element={<Register />} />
//       {/* <Route path="/Home" element={<Home />} /> */}
//       <Route path="/" element={<Landingpage />} />

//       {/* Default fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   </BrowserRouter>
// );

);


