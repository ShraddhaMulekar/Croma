import express from "express";
import ProductModel from "../models/product.model.js";
const productRouter = express.Router();
import qs from "qs"

//display product
productRouter.get("/display", async (req, res) => {
  const {category} = req.query
  try {
    let filterQuery = {}
    if(category){
      filterQuery.category = category
    }

    const product = await ProductModel.find(filterQuery);
    res.json({ msg: "products fetch successful...", product });

  } catch (error) {
    res.json({ msg: "error in product get router" });
  }
});

// Fetch product by ID
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json({ msg: "Product fetched successfully", product });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching product", error });
  }
});

//create/add product
productRouter.post("/add", async (req, res) => {
  const { img, title, description, price, category, subCategory } = req.body;
  try {
    const product = new ProductModel({
      img,
      title,
      description,
      price,
      category,
      subCategory,
    });
    await product.save();
    res.json({ msg: "Product add successful!..", product });
  } catch (error) {
    console.log("error in post route", error);
    res.json({ msg: "error in post router in product router!", error });
  }
});

//delete product
productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await ProductModel.findByIdAndDelete(id);
    if (!deleteProduct) {
      res.json({
        msg: "product not found please select product for deleted!..",
      });
    }
    res.json({ msg: "Product deleted successful!..", deleteProduct });
  } catch (error) {
    console.log("error in delete route", error);
    res.json({ msg: "error in delete route product page!..", error });
  }
});

// filter, search, sort, pagination
productRouter.get("/", async (req, res) => {
  const queryParameter = qs.parse(req.query);
  const { filter, search, sort, page, limit } = queryParameter;

  //search by tilte, description, category & subCategory
  try {
    const searchquery = {};
    if (search) {
      searchquery.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
        { subCategory: { $regex: search.trim(), $options: "i" } },
      ];
    }

    //filter by category & subCategory
    if (filter) {
      try {
        const filterData = JSON.parse(filter);
        if (filterData.category) {
          searchquery.category = filterData.category;
        }

        if (filterData.subCategory) {
          searchquery.subCategory = filterData.subCategory;
        }
      } catch (error) {
        res.json({ msg: "error in filter method", error });
      }
    }

    //sort by price
    const sortQuery = {};
    if (sort) {
      let [feild, order] = sort.split(":");
      if (feild && (order === "asc" || order === "desc")) {
        sortQuery[feild] = order === "asc" ? 1 : -1;
      } else {
        res.json({ msg: "error in sort method", error });
      }
    }

    // pagination
    if (page && limit) {
      const pageNo = +page || 1;
      const limits = limit || 5;
      const skip = (pageNo - 1) * limits;
      const totalProduct = await ProductModel.countDocuments(searchquery);

      const fetchProduct = await ProductModel.find(searchquery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limits);
      res.json({
        msg: "Product fetch successful!..",
        fetchProduct,
        pagination: {
          total: totalProduct,
          currentPage: page,
          totalPage: Math.ceil(totalProduct / limit),
        },
      });
    } else {
      let fetchProduct = await ProductModel.find(searchquery);
      res.json({
        msg: "all products fetch successfully!..",
        fetchProduct,
      });
    }
  } catch (error) {
    console.log("error in query method", error)
    res.json({ msg: "error in query method", error });
  }
});

export default productRouter;
