const BASE_URL = process.env.API_BASE_URL;
export const dashBoardDesigner = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `${BASE_URL}/order/total-orders/designer/${designerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};
export const dashBoardDesignerSales = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `${BASE_URL}/order/total-sales/designer/${designerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};

export const dashBoardDesignerProducts = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `${BASE_URL}/products/total-products/designer/${designerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};

export const getOrderForTable = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(`${BASE_URL}/order/designer/${designerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};
