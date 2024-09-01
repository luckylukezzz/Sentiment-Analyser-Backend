const getImprovementTips = async (req, res) => {
  const { asin } = req.query;
  console.log("Received ASIN for improvement:", asin);

  const improvementTips = [
    "Increase battery life to extend usage time and reduce customer complaints about frequent charging.",
    "Improve the durability of materials used to enhance product longevity and reduce wear and tear.",
    "Expand color options to appeal to a broader demographic and match customer preferences.",
    "Optimize the user interface for better accessibility, ensuring that all users can easily navigate the product.",
    "Enhance packaging to provide better protection during shipping and improve the unboxing experience.",
    "Reduce the weight of the product to make it more portable and convenient for users on the go.",
    "Offer customizable features to allow customers to personalize the product according to their needs.",
    "Increase the clarity of the instruction manual to reduce user confusion and improve setup time.",
    "Upgrade the camera quality to provide sharper and more vibrant images, meeting customer expectations.",
    "Add more connectivity options, such as Bluetooth and Wi-Fi, to increase the product's versatility.",
    "Introduce a loyalty program or discount for repeat purchases to encourage customer retention.",
    "Reduce the product's environmental impact by using eco-friendly materials and sustainable practices.",
  ];

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }
  console.log("sent resp for ASIN:", asin);
  return res.status(200).json(improvementTips);
};

module.exports = { getImprovementTips };
