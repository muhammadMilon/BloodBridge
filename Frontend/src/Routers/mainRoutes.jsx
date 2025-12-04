import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Blog from "../pages/Blog";
import DashboardLayout from "../layouts/DashboardLayout";
import DonationRequest from "../pages/donorDashboard/DonationRequest";
import CreateDonationRequest from "../pages/donorDashboard/CreateDonationRequest";
import PrivateRoute from "./PrivateRoute";
import AllUsers from "../pages/adminDashboard/AllUsers";
import Profile from "../pages/dashboard/Profile";
import AllBloodDonationRequest from "../pages/adminDashboard/AllBloodDonationRequest";
import ContentManagement from "../pages/adminDashboard/ContentManagement";
import AddBlog from "../pages/adminDashboard/AddBlog";
import Request from "../pages/Request";
import ViewDetails from "../pages/ViewDetails";
import UpdateDonationRequest from "../pages/UpdateDonationRequest";
import BlogDetails from "../pages/BlogDetails";
import Search from "../pages/Search";
import BloodHelper from "../pages/BloodHelper";
import HelpCenter from "../pages/HelpCenter";
const mainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "blog-details/:ID",
        element: (
          <PrivateRoute>
            <BlogDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "request",
        element: <Request />,
      },
      {
        path: "help-center",
        element: <HelpCenter />,
      },
      {
        path: "details/:ID",
        element: (
          <PrivateRoute>
            <ViewDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "blood-helper",
        element: <BloodHelper />,
      },

      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "registration",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <Dashboard></Dashboard>,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "all-users",
        element: <AllUsers />,
      },
      {
        path: "my-donation-requests",
        element: <DonationRequest />,
      },
      {
        path: "update-donation-request/:ID",
        element: <UpdateDonationRequest />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },
      {
        // admin
        path: "all-blood-donation-request",
        element: <AllBloodDonationRequest />,
      },
      {
        // admin
        path: "content-management",
        element: <ContentManagement />,
      },
      {
        // admin
        path: "content-management/add-blog",
        element: <AddBlog />,
      },
      // {
      //   path: "blog",
      //   element: <Blog></Blog>,
      // },
    ],
  },
]);

export default mainRoutes;
