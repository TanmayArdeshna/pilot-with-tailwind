import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
// import Register from "views/examples/Register.js";
// import Login from "views/examples/Login.js";
import Topics from "views/examples/Topics";
import Pauseexam from "views/examples/Pauseexam";
import Finishedexams from "views/examples/Finishedexams";
import Save from "views/examples/Save";
//import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  {
    path: "/topics",
    name: "Topics",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Topics />,
    layout: "/admin",
  },
  {
    path: "/pauseexams",
    name: "Paused exams",
    icon: "ni ni-button-pause text-blue",
    component: <Pauseexam />,
    layout: "/admin",
  },
  {
    path: "/finishedexams",
    name: "Finished exams",
    icon: "ni ni-hat-3 text-green",
    component: <Finishedexams />,
    layout: "/admin",
  },
  {
    path: "/savedquestions",
    name: "Saved questions",
    icon: "ni ni-key-25 text-purple",
    component: <Save />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   icon: "ni ni-key-25 text-info",
  //   component: <Login />,
  //   layout: "/auth",
  // },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: <Register />,
  //   layout: "/auth",
  // },
];
export default routes;
