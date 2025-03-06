import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;

    console.log("fetched products", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in getProducts", error);
    res.status(500).json(error);
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
        SELECT * FROM products
        WHERE id = ${id}
        `;

    console.log("Error in getProduct", product);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error in getProduct", error);
    res.status(500).json(error);
  }
};

export const createProduct = async (req, res) => {
  const { name, image, price } = req.body;

  try {
    const product = await sql`
        INSERT INTO products (name, image, price)
        VALUES (${name},${image},${price})
        RETURNING *
        `;

    console.log("Error in createProduct", product);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error in createProduct", error);
    res.status(500).json(error);
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price } = req.body;

  try {
    const product = await sql`
        UPDATE products
        SET name = ${name}, image = ${image}, price = ${price}
        WHERE id = ${id}
        RETURNING *
        `;

    console.log("Error in updateProduct", product);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error in updateProduct", error);
    res.status(500).json(error);
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
        DELETE FROM products
        WHERE id = ${id}
        RETURNING *
        `;

    console.log("Error in deleteProduct", product);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error in deleteProduct", error);
    res.status(500).json(error);
  }
};
