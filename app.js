const express = require("express");
const { success, failure } = require("./util/common");
const Product = require("./data/index");

const app = express();
app.use(express.json());

// Get all the products
app.get("/manga/all", async (req, res) => {
  try {
    const result = await Product.getAll();
    if (result.success) {
      res
        .status(200)
        .send(
          success("All products received properly", JSON.parse(result.data))
        );
    } else {
      res.send(400).send(failure("Failed to get all data"));
    }
  } catch (error) {
    res.status(400).send(failure("Failed to get all data"));
  }
});

// Get a specific product
app.get("/manga/get", async (req, res) => {
  const id = req.query.id;

  try {
    const result = await Product.getOneById(id);
    if (result.success) {
      res
        .status(200)
        .send(
          success("Product retrieved successfully", JSON.parse(result.data))
        );
    } else {
      res.status(404).send(failure(result.message));
    }
  } catch (error) {
    res.status(400).send(failure("Invalid request"));
  }
});

// Add a Product
app.post("/manga/create", async (req, res) => {
  try {
    const newData = req.body;

    // Validate properties
    if (newData.id) {
      return res
        .status(400)
        .send(failure("Can not have a user defined id property", "Reference"));
    }
    if (!newData.name || newData.name == "" || newData.name.trim() == "") {
      return res
        .status(400)
        .send(failure("Missing valid name property", "Reference"));
    }
    if (
      !newData.author ||
      newData.author == "" ||
      newData.author.trim() == ""
    ) {
      return res
        .status(400)
        .send(failure("Please input a valid author property", "Reference"));
    }
    if (!newData.price || newData.price > 15) {
      return res
        .status(400)
        .send(failure("Please input a valid price property", "Reference"));
    }
    if (!newData.stock || newData.stock < 1) {
      return res
        .status(400)
        .send(failure("Please input a valid stock property", "Reference"));
    }

    const result = await Product.addNewProduct(newData);

    if (result.success) {
      res.status(200).send(success(result.message, result.data));
    } else {
      res.status(500).send(failure(result.message));
    }
  } catch (error) {
    res.status(400).send(failure("Invalid JSON data"));
  }
});

// Update a Product
app.put("/manga/update", async (req, res) => {
  const { id } = req.query;

  try {
    const newData = req.body;
    const validationErrors = {};

    // Validate properties
    if (!newData.name || newData.name.trim() === "") {
      validationErrors.name = "Missing valid name property";
    }
    if (!newData.author || newData.author.trim() === "") {
      validationErrors.author = "Please input a valid author property";
    }
    if (!newData.price || newData.price > 15) {
      validationErrors.price = "Please input a valid price property";
    }
    if (!newData.stock || newData.stock < 1) {
      validationErrors.stock = "Please input a valid stock property";
    }

    if (Object.keys(validationErrors).length > 0) {
      return res
        .status(400)
        .send(failure("Validation errors", validationErrors));
    }

    const result = await Product.updateById(id, newData);

    if (result.success) {
      res.status(200).send(success(result.message, JSON.parse(result.data)));
    } else {
      res.status(500).send(failure(result.message));
    }
  } catch (error) {
    res.status(400).send(failure(result.message));
  }
});

// Delete a Product
app.delete("/manga/delete", async (req, res) => {
  const { id } = req.query;

  try {
    const result = await Product.deleteById(id);
    if (result.success) {
      res
        .status(200)
        .send(success("Product deleted successfully", JSON.parse(result.data)));
    } else {
      res.status(404).send(failure(result.message, result.error));
    }
  } catch (error) {
    res.status(400).send(failure("Invalid request", "Runtime Error"));
  }
});

app.use((req, res) => {
  res.status(404).send(failure("Invalid request", "Type"));
});

app.listen(8000, () => {
  console.log("Server is running on 8000...");
});
