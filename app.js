const http = require("http");
const { success, failure } = require("./util/common");
const Product = require("./data/index");

const server = http.createServer(function (req, res) {
  let body = "";
  req.on("data", (buffer) => {
    body += buffer;
  });

  req.on("end", async () => {
    console.log(req.url, req.method);

    // Adding a property
    if (req.url === "/manga/create" && req.method === "POST") {
      try {
        const newData = JSON.parse(body);

        // Validate properties
        if (newData.id) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            failure("Can not have a user defined id property", "Reference")
          );
          return res.end();
        }

        if (!newData.name || newData.name == "" || newData.name.trim() == "") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(failure("Missing valid name property", "Reference"));
          return res.end();
        }
        if (
          !newData.author ||
          newData.author == "" ||
          newData.author.trim() == ""
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            failure("Please input a valid author property", "Reference")
          );
          return res.end();
        }
        if (!newData.price || newData.price > 15) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            failure("Please input a valid price property", "Reference")
          );
          return res.end();
        }
        if (!newData.stock || newData.stock < 1) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            failure("Please input a valid stock property", "Reference")
          );
          return res.end();
        }
        const result = await Product.addNewProduct(newData);

        if (result.success) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(success(result.message, result.data));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.write(failure(result.message));
        }
        return res.end();
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(failure("Invalid JSON data"));
        return res.end();
      }
    }

    // Get All Products
    else if (req.url === "/manga/all" && req.method === "GET") {
      try {
        const result = await Product.getAll();
        if (result.success) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(
            success("All products received properly", JSON.parse(result.data))
          );
          return res.end();
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(failure("Failed to get all data"));
        return res.end();
      }
    }

    // Get a specific product by ID
    else if (req.url.startsWith("/manga/get") && req.method === "GET") {
      const getQueryParams = () => {
        const params = new URLSearchParams(req.url.split("?")[1]);
        console.log(params);
        const queryParams = {};
        for (const param of params) {
          queryParams[param[0]] = param[1];
          console.log(queryParams);
        }
        return queryParams;
      };

      const queryParams = getQueryParams();
      const id = queryParams.id;

      try {
        const result = await Product.getOneById(id);
        if (result.success) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(
            success("Product retrieved successfully", JSON.parse(result.data))
          );
          return res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(failure(result.message));
          return res.end();
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(failure("Invalid product ID"));
        return res.end();
      }
    }

    // Delete a product by ID
    else if (req.url.startsWith("/manga/delete") && req.method === "DELETE") {
      const getQueryParams = () => {
        const params = new URLSearchParams(req.url.split("?")[1]);
        console.log(params);
        const queryParams = {};
        for (const param of params) {
          queryParams[param[0]] = param[1];
          console.log(queryParams);
        }
        return queryParams;
      };

      const queryParams = getQueryParams();
      const id = queryParams.id;

      try {
        const result = await Product.deleteById(id);
        if (result.success) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(
            success("Product deleted successfully", JSON.parse(result.data))
          );
          return res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(failure(result.message, result.error));
          return res.end();
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(failure("Invalid product ID", "Runtime Error"));
        return res.end();
      }
    }

    // Update by ID
    else if (req.url.startsWith("/manga/update") && req.method === "PUT") {
      const getQueryParams = () => {
        const params = new URLSearchParams(req.url.split("?")[1]);
        console.log(params);
        const queryParams = {};
        for (const param of params) {
          queryParams[param[0]] = param[1];
          console.log(queryParams);
        }
        return queryParams;
      };

      const queryParams = getQueryParams();
      const id = queryParams.id;

      try {
        const newData = JSON.parse(body);

        // Validate properties
        if (!newData.name || newData.name == "" || newData.name.trim() == "") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(failure("Missing valid name property", "Reference"));
          return res.end();
        }
        if (
          !newData.author ||
          newData.author == "" ||
          newData.author.trim() == ""
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            failure("Please input a valid author property", "Reference")
          );
          return res.end();
        }
        if (!newData.price || newData.price > 15) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            failure("Please input a valid price property", "Reference")
          );
          return res.end();
        }
        if (!newData.stock || newData.stock < 1) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            failure("Please input a valid stock property", "Reference")
          );
          return res.end();
        }
        const result = await Product.updateById(id, newData);

        if (result.success) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(success(result.message, JSON.parse(result.data)));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.write(failure(result.message));
        }
        return res.end();
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(failure("Invalid JSON data"));
        return res.end();
      }
    }
    // Handle invalid URL
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(failure("Invalid request", "Type"));
      return res.end();
    }
  });
});

server.listen(8000, () => {
  console.log("Server is running on 8000...");
});
