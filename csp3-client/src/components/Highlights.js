import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
import Product from "./Product";

export default function Highlights({ data }) {

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(res => res.json())
      .then(apiData => {
        const numbers = new Set();
        const maxHighlights = Math.min(5, apiData.length);

        while (numbers.size < maxHighlights) {
          numbers.add(Math.floor(Math.random() * apiData.length));
        }

        const products = Array.from(numbers).map(idx => (
          <Product
            data={apiData[idx]}
            key={apiData[idx]._id}
            breakPoint={2}
          />
        ));

        setPreviews(products);
      });
  }, []);

  return (
    <CardGroup className="d-flex justify-content-between p-5">
      {previews}
    </CardGroup>
  );

}
