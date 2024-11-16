const designerId = localStorage.getItem("designerId");

export const createShippingOrder = async (shippingDetails) => {
  const response = await fetch(
    "https://indigo-rhapsody-backend-ten.vercel.app/shipping/createOrder",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shippingDetails),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create shipping order");
  }
  return data;
  x;
};

export const createManifest = async (shipmentId) => {
  const response = await fetch(
    "https://indigo-rhapsody-backend-ten.vercel.app/shipping/generate-manifest",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipment_id: shipmentId }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create manifest");
  }
  return data;
};

export const createInvoice = async (shipmentId) => {
  const response = await fetch(
    "https://indigo-rhapsody-backend-ten.vercel.app/shipping/generate-manifest",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipment_id: shipmentId }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create invoice");
  }
  return data;
};

export const getShippingDetails = async (shipmentId) => {
  const response = await fetch(
    `https://indigo-rhapsody-backend-ten.vercel.app/shipping/designer/${designerId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to get shipping details");
  }
  return data;
};
