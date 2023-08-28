const fs = require("fs").promises;
const path = require("path");

class Product {
  async getAll() {
    return fs
      .readFile(path.join(__dirname, "manga.json"), "utf-8")
      .then((data) => {
        return { success: true, data: data };
      })
      .catch((error) => {
        console.log(error);
        return { success: false };
      });
  }

  async addNewProduct(newProduct) {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "manga.json"),
        "utf-8"
      );
      const jsonData = JSON.parse(data);
      const nextId = jsonData[jsonData.length - 1].id + 1;
      const productToAdd = { ...newProduct, id: nextId };
      jsonData.push(productToAdd);

      await fs.writeFile(
        path.join(__dirname, "manga.json"),
        JSON.stringify(jsonData)
      );

      // Record add time in log.json
      const currentTime = new Date().toISOString();
      const logData = await fs.readFile(
        path.join(__dirname, "log.json"),
        "utf-8"
      );
      const logJsonData = JSON.parse(logData);
      logJsonData.push({
        type: "create",
        id: nextId,
        timestamp: currentTime,
      });
      await fs.writeFile(
        path.join(__dirname, "log.json"),
        JSON.stringify(logJsonData)
      );
      // log.json code finished for adding

      return {
        success: true,
        message: "Product added successfully",
        data: productToAdd,
      };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, message: "Failed to add product" };
    }
  }

  async getOneById(id) {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "manga.json"),
        "utf-8"
      );
      const jsonData = JSON.parse(data);
      const product = jsonData.find((item) => item.id === parseInt(id));

      if (product) {
        return { success: true, data: JSON.stringify(product) };
      } else {
        return { success: false, message: "Product not found" };
      }
    } catch (error) {
      console.error("Error getting product by ID:", error);
      return { success: false, message: "Failed to get product by ID" };
    }
  }

  async updateById(id, product) {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "manga.json"),
        "utf-8"
      );
      const jsonData = JSON.parse(data);

      if (product.id) {
        return { success: false, message: "ID can not be updated" };
      }

      let propertyExist = false;

      let updatedData = jsonData.map((object) => {
        if (object.id == id) {
          propertyExist = true;
          object = { ...object, ...product };
        }
        return object;
      });

      if (propertyExist) {
        fs.writeFile("./data/manga.json", JSON.stringify(updatedData));

        // Record update time in log.json
        const currentTime = new Date().toISOString();
        const logData = await fs.readFile(
          path.join(__dirname, "log.json"),
          "utf-8"
        );
        const logJsonData = JSON.parse(logData);
        logJsonData.push({
          type: "update",
          id: id,
          timestamp: currentTime,
        });
        await fs.writeFile(
          path.join(__dirname, "log.json"),
          JSON.stringify(logJsonData)
        );
        // log.json code finished for updating

        return { success: true, data: JSON.stringify(updatedData) };
      } else {
        return { success: false, message: "Product not found" };
      }
    } catch (error) {
      console.error("Error getting product by ID:", error);
      return { success: false, message: "Failed to get product by ID" };
    }
  }

  async deleteById(id) {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "manga.json"),
        "utf-8"
      );
      const jsonData = JSON.parse(data);
      const product = jsonData.find((item) => item.id === parseInt(id));

      if (product) {
        const newJsonData = jsonData.filter((property) => {
          return property.id !== product.id;
        });
        await fs.writeFile(
          path.join(__dirname, "manga.json"),
          JSON.stringify(newJsonData)
        );

        // Record delete time in log.json
        const currentTime = new Date().toISOString();
        const logData = await fs.readFile(
          path.join(__dirname, "log.json"),
          "utf-8"
        );
        const logJsonData = JSON.parse(logData);
        logJsonData.push({
          type: "delete",
          id: id,
          timestamp: currentTime,
        });
        await fs.writeFile(
          path.join(__dirname, "log.json"),
          JSON.stringify(logJsonData)
        );
        // log.json code finished for deleting
        return { success: true, data: JSON.stringify(newJsonData) };
      } else {
        return {
          success: false,
          message: "Product not found",
          error: "Type Error",
        };
      }
    } catch (error) {
      console.error("Error getting product by ID:", error);
      return { success: false, message: "Failed to get product by ID" };
    }
  }
}

module.exports = new Product();
