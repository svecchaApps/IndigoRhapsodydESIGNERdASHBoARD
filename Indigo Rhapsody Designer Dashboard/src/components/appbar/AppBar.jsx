import React, { useState, useRef, useEffect } from "react";
import { AppBarWrap } from "./Appbar.styles";
import { MdOutlineMenu, MdNotificationsNone } from "react-icons/md";
import { Icons } from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import { dashBoardDesigner } from "../../service/notificationService"; // Adjust the path as necessary

function AppBar() {
  const navigate = useNavigate();
  const [showInputControl, setShowInputControl] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPages, setFilteredPages] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("Orders");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const inputControlRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await dashBoardDesigner();
        setNotifications(data.notifications || []);
        // const unread = data.notifications.filter((notif) => !notif.seen).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleInputControlVisibility = () => setShowInputControl(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await dashBoardDesigner();
        if (data && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          const unread = data.notifications.filter(
            (notif) => !notif.seen
          ).length;
          setUnreadCount(unread);
        } else {
          setNotifications([]); // Set an empty array if notifications are undefined or not an array
          setUnreadCount(0);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filtered = pages.filter((page) =>
        page.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPages(filtered);
    } else {
      setFilteredPages([]);
    }
  };

  const handlePageClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setFilteredPages([]);
    setShowInputControl(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (notification) => {
    // Mark the notification as read (update backend if necessary)
    notification.seen = true; // This is for immediate UI feedback; sync with backend as needed
    setUnreadCount(unreadCount - 1);
    navigate("/dashboard/orders");
  };

  return (
    <AppBarWrap>
      <div className="appbar-content">
        <div className="appbar-left">
          <button type="button" className="sidebar-open-btn">
            <MdOutlineMenu size={24} />
          </button>
          <h3 className="appbar-title">Dashboard</h3>
        </div>
        <div className="appbar-right">
          <div className="appbar-search">
            <form>
              <div className="input-group" ref={inputControlRef}>
                <span
                  className="input-icon"
                  onClick={handleInputControlVisibility}
                >
                  <img
                    src={Icons.SearchBlue}
                    alt=""
                    className="input-icon-img"
                  />
                </span>
                <input
                  type="text"
                  placeholder="Search Here ..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`input-control ${
                    showInputControl ? "show-input-control" : ""
                  }`}
                />
                {showInputControl && filteredPages.length > 0 && (
                  <ul className="search-results">
                    {filteredPages.map((page, index) => (
                      <li
                        key={index}
                        onClick={() => handlePageClick(page.path)}
                        className="search-result-item"
                      >
                        {page.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>
          </div>

          {/* Notification Bell Icon */}
          <button className="notification-bell" onClick={toggleNotifications}>
            <MdNotificationsNone size={24} />
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Modal for Notifications */}
      {showNotifications && (
        <div className="notification-modal">
          <div className="modal-header">
            <button
              className={`tab-button ${activeTab === "Orders" ? "active" : ""}`}
              onClick={() => setActiveTab("Orders")}
            >
              Orders
            </button>
            <button
              className={`tab-button ${
                activeTab === "Return Requests" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Return Requests")}
            >
              Return Requests
            </button>
          </div>
          <div className="modal-content">
            {activeTab === "Orders" && (
              <div>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`notification-item ${
                        !notification.seen ? "unread" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p>{notification.message}</p>
                      <small>
                        {new Date(notification.createdDate).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p>No notifications available</p>
                )}
              </div>
            )}
            {activeTab === "Return Requests" && (
              <div>Return request notifications content</div>
            )}
          </div>
        </div>
      )}
    </AppBarWrap>
  );
}

export default AppBar;
