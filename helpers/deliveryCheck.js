function scheduleDelivery(deliveryDate, deliveryType, distanceInKm, res) {
    if (deliveryType === 'Instant delivery') {
        const today = new Date();
        const currentHour = today.getHours();
        const deliverySpeedKmph = 40; // Assuming a delivery speed in km/h
        const estimatedDeliveryTimeHours = distanceInKm / deliverySpeedKmph;
      
        if (currentHour + estimatedDeliveryTimeHours <= 24) {
          // If the estimated delivery time is within the remaining hours of the day, deliver today.
          return today;
        } else {
          // Calculate the remaining hours in the day.
          const remainingHoursInDay = 24 - currentHour;
          const remainingDays = Math.ceil(estimatedDeliveryTimeHours / 24);
      
          // Calculate the delivery date and time.
          const futureDate = new Date(today.getTime());
          futureDate.setHours(currentHour + remainingHoursInDay);
          futureDate.setDate(today.getDate() + remainingDays);
      
          return futureDate;
        }
    } else {
        const dateObject = new Date(deliveryDate);

    if (isNaN(dateObject)) {
        return res.status(400).json({
            status: 'error',
            error: 'Invalid date format'
        });
    }
      const deliverySpeedKmph = 40;

      const estimatedDeliveryTimeHours = distanceInKm / deliverySpeedKmph;
  
      const deliveryDateTime = new Date(deliveryDate);
      deliveryDateTime.setHours(deliveryDateTime.getHours() + estimatedDeliveryTimeHours);
  
      return deliveryDateTime.toISOString();
    }
}

module.exports = scheduleDelivery;
  