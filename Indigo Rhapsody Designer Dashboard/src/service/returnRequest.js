export const getReturnRequest = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/order/return-requests/${designerId}`,
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
