const getPosTerms = async (req, res) => {
  const { asin } = req.query;
  console.log("Received ASIN for post terms:", asin);

  const positiveTerms = [
    "Excellent",
    "Outstanding product amazing Outstanding product amazing",
    "Fantastic",
    "Wonderful",
    "Great",
    "Amazing",
    "Superb",
    "Impressive",
    "Marvelous",
    "Exceptional",
    "Excellent",
    "Outstanding",
    "Fantastic",
    "Wonderful",
    "Great",
    "Amazing",
    "Superb",
    "Impressive",
    "Marvelous",
    "Exceptional",
  ];

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }
  console.log("sent resp for ASIN:", asin);
  return res.status(200).json(positiveTerms);
};

const getNegTerms = async (req, res) => {
  const { asin } = req.query;
  console.log("Received ASIN for neg terms:", asin);

  const negativeTerms = [
    "Terrible",
    "Awful",
    "Horrible",
    "Poor",
    "Bad",
    "Dreadful",
    "Unpleasant",
    "Disappointing",
    "Mediocre",
    "Subpar",
  ];

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }
  console.log("sent resp for ASIN:", asin);
  return res.status(200).json(negativeTerms);
};

module.exports = { getPosTerms, getNegTerms };
