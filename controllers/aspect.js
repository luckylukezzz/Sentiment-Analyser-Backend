getAspectInfo = async (req, res) => {
  const { asin } = req.query;

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  console.log("Received ASIN for aspect info:", asin);

  async function getAspectData(parentAsin) {
    const pool = req.mysqlPool;

    try {
      const [rows] = await pool.query(
        `
        SELECT 
          aspect_quality, quality_score, aspect_price, price_score, aspect_shipping, shipping_score, aspect_customer_service, customer_service_score, aspect_warranty, warranty_score 
        FROM
          reviews
        WHERE 
          parent_asin = ?;
        `,
        [parentAsin]
      );

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "No data found for the given ASIN." });
      }

      // Initialize accumulators for each aspect
      let positive_aspect_quality = [];
      let negative_aspect_quality = [];
      let neutral_aspect_quality = [];

      let positive_aspect_price = [];
      let negative_aspect_price = [];
      let neutral_aspect_price = [];

      let positive_aspect_shipping = [];
      let negative_aspect_shipping = [];
      let neutral_aspect_shipping = [];

      let positive_aspect_customer_service = [];
      let negative_aspect_customer_service = [];
      let neutral_aspect_customer_service = [];

      let positive_aspect_warranty = [];
      let negative_aspect_warranty = [];
      let neutral_aspect_warranty = [];

      // Loop through the rows and accumulate scores based on aspect sentiment
      rows.forEach(row => {
        // Quality
        if (row['aspect_quality'] === 'Positive') {
          positive_aspect_quality.push(row['quality_score']);
        } else if (row['aspect_quality'] === 'Negative') {
          negative_aspect_quality.push(row['quality_score']);
        } else if (row['aspect_quality'] === 'Neutral') {
          neutral_aspect_quality.push(row['quality_score']);
        }

        // Price
        if (row['aspect_price'] === 'Positive') {
          positive_aspect_price.push(row['price_score']);
        } else if (row['aspect_price'] === 'Negative') {
          negative_aspect_price.push(row['price_score']);
        } else if (row['aspect_price'] === 'Neutral') {
          neutral_aspect_price.push(row['price_score']);
        }

        // Shipping
        if (row['aspect_shipping'] === 'Positive') {
          positive_aspect_shipping.push(row['shipping_score']);
        } else if (row['aspect_shipping'] === 'Negative') {
          negative_aspect_shipping.push(row['shipping_score']);
        } else if (row['aspect_shipping'] === 'Neutral') {
          neutral_aspect_shipping.push(row['shipping_score']);
        }

        // Customer Service
        if (row['aspect_customer_service'] === 'Positive') {
          positive_aspect_customer_service.push(row['customer_service_score']);
        } else if (row['aspect_customer_service'] === 'Negative') {
          negative_aspect_customer_service.push(row['customer_service_score']);
        } else if (row['aspect_customer_service'] === 'Neutral') {
          neutral_aspect_customer_service.push(row['customer_service_score']);
        }

        // Warranty
        if (row['aspect_warranty'] === 'Positive') {
          positive_aspect_warranty.push(row['warranty_score']);
        } else if (row['aspect_warranty'] === 'Negative') {
          negative_aspect_warranty.push(row['warranty_score']);
        } else if (row['aspect_warranty'] === 'Neutral') {
          neutral_aspect_warranty.push(row['warranty_score']);
        }
      });

      // Helper function to calculate weighted sentiment
      const calculateWeightedSentiment = (positiveScores, neutralScores, negativeScores) => {
        const totalPositive = positiveScores.reduce((sum, val) => sum + val, 0);
        const totalNeutral = neutralScores.reduce((sum, val) => sum + val, 0);
        const totalNegative = negativeScores.reduce((sum, val) => sum + val, 0);

        const totalScores = totalPositive + totalNeutral + totalNegative;

        if (totalScores === 0) return 0;

        const weightedSentiment = (
          (totalPositive * 1) + 
          (totalNeutral * 0) + 
          (totalNegative * -1)
        ) / totalScores;

        return weightedSentiment;
      };

      const classifySentiment = (score) => {
        if (score >= 0.25) return 'Positive';
        if (score <= -0.25) return 'Negative';
        return 'Neutral';
      };

      // Calculate sentiment and format into the required structure
      const aspectList = [
        {
          icon: 'BiSolidCrown',  // Send icon name as a string
          score: calculateWeightedSentiment(positive_aspect_quality, neutral_aspect_quality, negative_aspect_quality).toFixed(2),
          title: 'Quality',
          sentiment: classifySentiment(calculateWeightedSentiment(positive_aspect_quality, neutral_aspect_quality, negative_aspect_quality)),
          iconColor: '#03C9D7',
          iconBg: '#E5FAFB',
          pcColor: classifySentiment(calculateWeightedSentiment(positive_aspect_quality, neutral_aspect_quality, negative_aspect_quality)) === 'Positive' ? 'green-600' : 'red-600',
        },
        {
          icon: 'BsCurrencyDollar',  // Send icon name as a string
          score: calculateWeightedSentiment(positive_aspect_price, neutral_aspect_price, negative_aspect_price).toFixed(2),
          title: 'Price',
          sentiment: classifySentiment(calculateWeightedSentiment(positive_aspect_price, neutral_aspect_price, negative_aspect_price)),
          iconColor: 'rgb(0, 194, 146)',
          iconBg: 'rgb(235, 250, 242)',
          pcColor: classifySentiment(calculateWeightedSentiment(positive_aspect_price, neutral_aspect_price, negative_aspect_price)) === 'Positive' ? 'green-600' : 'red-600',
        },
        {
          icon: 'TbTruckDelivery',  // Send icon name as a string
          score: calculateWeightedSentiment(positive_aspect_shipping, neutral_aspect_shipping, negative_aspect_shipping).toFixed(2),
          title: 'Shipping',
          sentiment: classifySentiment(calculateWeightedSentiment(positive_aspect_shipping, neutral_aspect_shipping, negative_aspect_shipping)),
          iconColor: 'rgb(255, 244, 229)',
          iconBg: 'rgb(254, 201, 15)',
          pcColor: classifySentiment(calculateWeightedSentiment(positive_aspect_shipping, neutral_aspect_shipping, negative_aspect_shipping)) === 'Positive' ? 'green-600' : 'red-600',
        },
        {
          icon: 'FcCustomerSupport',  // Send icon name as a string
          score: calculateWeightedSentiment(positive_aspect_customer_service, neutral_aspect_customer_service, negative_aspect_customer_service).toFixed(2),
          title: 'Customer Service',
          sentiment: classifySentiment(calculateWeightedSentiment(positive_aspect_customer_service, neutral_aspect_customer_service, negative_aspect_customer_service)),
          iconColor: 'rgb(228, 106, 118)',
          iconBg: 'rgb(255, 244, 229)',
          pcColor: classifySentiment(calculateWeightedSentiment(positive_aspect_customer_service, neutral_aspect_customer_service, negative_aspect_customer_service)) === 'Positive' ? 'green-600' : 'red-600',
        },
        {
          icon: 'LiaCertificateSolid',  // Send icon name as a string
          score: calculateWeightedSentiment(positive_aspect_warranty, neutral_aspect_warranty, negative_aspect_warranty).toFixed(2),
          title: 'Warranty',
          sentiment: classifySentiment(calculateWeightedSentiment(positive_aspect_warranty, neutral_aspect_warranty, negative_aspect_warranty)),
          iconColor: '#03C9D7',
          iconBg: '#E5FAFB',
          pcColor: classifySentiment(calculateWeightedSentiment(positive_aspect_warranty, neutral_aspect_warranty, negative_aspect_warranty)) === 'Positive' ? 'green-600' : 'red-600',
        },
      ];

      return res.status(200).json(aspectList);

    } catch (err) {
      console.error("Error fetching aspect data:", err);
      return res.status(500).json({ error: "Error fetching aspect chart data" });
    }
  }

  return getAspectData(asin);
};

module.exports = { getAspectInfo };
